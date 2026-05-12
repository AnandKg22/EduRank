import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { MATCH_CONFIG } from '../lib/constants';
import { getRandomBot, generateId } from '../lib/utils';

/**
 * Matchmaking Store — Manages queue state, opponent search, and bot fallback.
 */
const useMatchmakingStore = create((set, get) => ({
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
   * Join the matchmaking queue.
   */
  joinQueue: async (userId, department, eloRating) => {
    set({ isSearching: true, searchTime: 0, error: null });

    try {
      // Insert into queue
      const { data, error } = await supabase
        .from('matchmaking_queue')
        .insert({
          user_id: userId,
          department,
          elo_rating: eloRating,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) throw error;

      set({ queueEntryId: data.id });

      // Start search timer
      const interval = setInterval(() => {
        const state = get();
        const newTime = state.searchTime + 1;
        set({ searchTime: newTime });

        // Periodic polling to match waiting players who joined earlier
        if (newTime % 3 === 0 && state.isSearching) {
          get().tryFindMatch(userId, department, eloRating, data.id, data.joined_at);
        }

        // Bot fallback after timeout
        if (newTime >= MATCH_CONFIG.BOT_SEARCH_TIMEOUT) {
          get().spawnBot(userId);
        }
      }, 1000);

      set({ searchInterval: interval });

      // Subscribe to queue changes for this entry
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

      // Also try to find a match immediately
      get().tryFindMatch(userId, department, eloRating, data.id, data.joined_at);
    } catch (error) {
      set({ isSearching: false, error: error.message });
    }
  },

  /**
   * Try to find a compatible opponent in the queue.
   * Restricts matching direction to prevent concurrent split-brain room creation.
   */
  tryFindMatch: async (userId, department, eloRating, queueId, joinedAt) => {
    if (!joinedAt) return;
    try {
      // Look for opponents who joined EARLIER than us: same department + ELO within 200 first
      let { data: opponents } = await supabase
        .from('matchmaking_queue')
        .select('*')
        .eq('status', 'waiting')
        .eq('department', department)
        .neq('user_id', userId)
        .lt('joined_at', joinedAt)
        .gte('elo_rating', eloRating - 200)
        .lte('elo_rating', eloRating + 200)
        .order('joined_at', { ascending: true })
        .limit(1);

      // If no close match, widen search to any opponent who joined earlier
      if (!opponents || opponents.length === 0) {
        const { data: widerOpponents } = await supabase
          .from('matchmaking_queue')
          .select('*')
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

        // Create the single source-of-truth battle row
        const { error: battleError } = await supabase.from('battles').insert({
          id: battleId,
          player_a: userId,
          player_b: opponent.user_id,
          status: 'preparing',
        });

        if (battleError) throw battleError;

        // Update both queue entries to point to this identical battleId
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
    } catch (error) {
      console.error('Match search error:', error);
    }
  },

  /**
   * Handle match found event.
   */
  onMatchFound: async (battleId, opponentId) => {
    const state = get();

    // Clear timer
    if (state.searchInterval) clearInterval(state.searchInterval);

    // Fetch opponent profile
    const { data: opponentProfile } = await supabase
      .from('profiles')
      .select('*')
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
   * Spawn a bot match after timeout.
   */
  spawnBot: async (userId) => {
    const state = get();
    if (!state.isSearching) return;

    // Clear timer
    if (state.searchInterval) clearInterval(state.searchInterval);

    const bot = getRandomBot();
    const battleId = generateId();

    try {
      // Remove from queue
      if (state.queueEntryId) {
        await supabase
          .from('matchmaking_queue')
          .delete()
          .eq('id', state.queueEntryId);
      }

      // Create bot battle
      const { error } = await supabase.from('battles').insert({
        id: battleId,
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
    } catch (error) {
      console.error('Bot spawn error:', error);
      set({ isSearching: false, error: error.message });
    }
  },

  /**
   * Leave the matchmaking queue.
   */
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

  /**
   * Full reset.
   */
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
