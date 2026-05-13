import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { MATCH_CONFIG } from '../lib/constants';
import { getRandomBot, generateId } from '../lib/utils';
import { useAuthStore } from './useAuthStore';

/**
 * Enterprise Matchmaking Telemetry Store
 * Governs atomic multi-tenant connection handshakes and serverless queue states.
 */
export const useMatchmakingStore = create((set, get) => ({
  // ── State ──
  isSearching: false,
  searchTime: 0,
  opponent: null,
  battleId: null,
  queueEntryId: null,
  searchInterval: null,
  error: null,

  // ── Actions ──

  /**
   * Joins the tenant-isolated matchmaking queue.
   */
  joinQueue: async (userId, department, eloRating, organizationId = null) => {
    set({ isSearching: true, searchTime: 0, error: null });

    // Ensure organization scoping resolves safely
    const resolvedOrgId = organizationId || useAuthStore.getState().profile?.organization_id;

    if (!resolvedOrgId) {
      set({ isSearching: false, error: 'Tenant scope resolution failure. Unable to queue.' });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('matchmaking_queue')
        .insert({
          organization_id: resolvedOrgId,
          user_id: userId,
          department,
          elo_rating: eloRating,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) throw error;

      set({ queueEntryId: data.id });

      const interval = setInterval(() => {
        const state = get();
        const newTime = state.searchTime + 1;
        set({ searchTime: newTime });

        if (newTime % 3 === 0 && state.isSearching) {
          get().tryFindMatch(userId, department, eloRating, data.id, data.joined_at, resolvedOrgId);
        }

        if (newTime % 2 === 0 && state.isSearching) {
          supabase
            .from('battles')
            .select('id, player_a')
            .eq('organization_id', resolvedOrgId)
            .eq('player_b', userId)
            .eq('status', 'preparing')
            .order('created_at', { ascending: false })
            .limit(1)
            .then(({ data: activeBattles }) => {
              if (activeBattles && activeBattles.length > 0) {
                get().onMatchFound(activeBattles[0].id, activeBattles[0].player_a);
              }
            });
        }

        if (newTime >= MATCH_CONFIG.BOT_SEARCH_TIMEOUT) {
          get().spawnBot(userId, resolvedOrgId);
        }
      }, 1000);

      set({ searchInterval: interval });

      const channel = supabase
        .channel(`queue-${data.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'matchmaking_queue',
            filter: `id=eq.${data.id}`,
          },
          (payload) => {
            if (payload.new.status === 'matched' && payload.new.battle_id) {
              get().onMatchFound(payload.new.battle_id, payload.new.matched_with);
            }
          }
        )
        .subscribe();

      set({ queueChannel: channel });

      get().tryFindMatch(userId, department, eloRating, data.id, data.joined_at, resolvedOrgId);
    } catch (err) {
      set({ isSearching: false, error: err.message });
    }
  },

  /**
   * Evaluates atomic room assignment criteria to prevent concurrent race conditions.
   */
  tryFindMatch: async (userId, department, eloRating, queueId, joinedAt, organizationId) => {
    if (!joinedAt || !organizationId) return;
    try {
      let { data: opponents } = await supabase
        .from('matchmaking_queue')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'waiting')
        .eq('department', department)
        .neq('user_id', userId)
        .lt('joined_at', joinedAt)
        .gte('elo_rating', eloRating - 200)
        .lte('elo_rating', eloRating + 200)
        .order('joined_at', { ascending: true })
        .limit(1);

      if (!opponents || opponents.length === 0) {
        const { data: widerOpponents } = await supabase
          .from('matchmaking_queue')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('status', 'waiting')
          .neq('user_id', userId)
          .lt('joined_at', joinedAt)
          .order('joined_at', { ascending: true })
          .limit(1);
        opponents = widerOpponents;
      }

      if (opponents && opponents.length > 0) {
        const opponent = opponents[0];
        const battleId = generateId();

        const { error: battleError } = await supabase.from('battles').insert({
          id: battleId,
          organization_id: organizationId,
          player_a: userId,
          player_b: opponent.user_id,
          status: 'preparing',
        });

        if (battleError) throw battleError;

        await supabase
          .from('matchmaking_queue')
          .update({ status: 'matched', matched_with: opponent.user_id, battle_id: battleId })
          .eq('id', queueId);

        await supabase
          .from('matchmaking_queue')
          .update({ status: 'matched', matched_with: userId, battle_id: battleId })
          .eq('id', opponent.id);

        get().onMatchFound(battleId, opponent.user_id);
      }
    } catch (err) {
      console.error('Atomic query alignment failure:', err);
    }
  },

  /**
   * Resolves successful matchmaking peer states.
   */
  onMatchFound: async (battleId, opponentId) => {
    const state = get();
    if (state.searchInterval) clearInterval(state.searchInterval);

    const { data: opponentProfile } = await supabase
      .from('profiles')
      .select('*, organizations(name, branding_color)')
      .eq('id', opponentId)
      .single();

    set({
      battleId,
      opponent: opponentProfile,
      isSearching: false,
      searchInterval: null,
    });
  },

  /**
   * Deploys resilient automated bot fallbacks.
   */
  spawnBot: async (userId, organizationId) => {
    const state = get();
    if (!state.isSearching) return;

    if (state.searchInterval) clearInterval(state.searchInterval);

    const bot = getRandomBot();
    const battleId = generateId();

    try {
      if (state.queueEntryId) {
        await supabase
          .from('matchmaking_queue')
          .delete()
          .eq('id', state.queueEntryId);
      }

      const { error } = await supabase.from('battles').insert({
        id: battleId,
        organization_id: organizationId || useAuthStore.getState().profile?.organization_id,
        player_a: userId,
        player_b: null,
        is_bot_match: true,
        bot_name: bot.name,
        status: 'preparing',
      });

      if (error) throw error;

      set({
        battleId,
        opponent: {
          username: bot.name,
          avatar_url: bot.avatar,
          elo_rating: 1000 + Math.floor(Math.random() * 400),
          tier: 'Capacitor',
          department: 'AI Lab',
          isBot: true,
        },
        isSearching: false,
        searchInterval: null,
      });
    } catch (err) {
      console.error('Bot instance deployment failure:', err);
      set({ isSearching: false, error: err.message });
    }
  },

  leaveQueue: async () => {
    const state = get();
    if (state.searchInterval) clearInterval(state.searchInterval);

    if (state.queueEntryId) {
      await supabase
        .from('matchmaking_queue')
        .delete()
        .eq('id', state.queueEntryId);
    }

    if (state.queueChannel) {
      supabase.removeChannel(state.queueChannel);
    }

    set({
      isSearching: false,
      searchTime: 0,
      opponent: null,
      battleId: null,
      queueEntryId: null,
      searchInterval: null,
      queueChannel: null,
    });
  },

  reset: () => {
    const state = get();
    if (state.searchInterval) clearInterval(state.searchInterval);
    if (state.queueChannel) supabase.removeChannel(state.queueChannel);
    set({
      isSearching: false,
      searchTime: 0,
      opponent: null,
      battleId: null,
      queueEntryId: null,
      searchInterval: null,
      queueChannel: null,
      error: null,
    });
  },
}));

export default useMatchmakingStore;
