import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import useGameStore from '../stores/useGameStore';
import useAuthStore from '../stores/useAuthStore';
import { MATCH_CONFIG } from '../lib/constants';

/**
 * useBattleChannel — Manages the real-time battle communication channel.
 * Handles Broadcast (answer exchange), Presence (disconnect detection),
 * and Postgres Changes (battle status updates).
 */
export default function useBattleChannel(battleId) {
  const channelRef = useRef(null);
  const forfeitTimerRef = useRef(null);
  const user = useAuthStore((s) => s.user);
  const syncOpponentAnswer = useGameStore((s) => s.syncOpponentAnswer);
  const handleForfeit = useGameStore((s) => s.handleForfeit);

  /**
   * Send an answer event to the opponent via Broadcast.
   */
  const sendAnswer = useCallback(
    (answer) => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'answer',
          payload: { ...answer, userId: user?.id },
        });
      }
    },
    [user?.id]
  );

  /**
   * Send a "ready" signal to synchronize battle start.
   */
  const sendReady = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'ready',
        payload: { userId: user?.id },
      });
    }
  }, [user?.id]);

  /**
   * Send a "next_question" signal for question sync.
   */
  const sendNextQuestion = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'next_question',
        payload: { userId: user?.id },
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (!battleId || !user) return;

    const channel = supabase.channel(`battle:${battleId}`, {
      config: {
        presence: { key: user.id },
      },
    });

    // ── Broadcast: Answer Exchange ──
    channel.on('broadcast', { event: 'answer' }, (payload) => {
      if (payload.payload.userId !== user.id) {
        syncOpponentAnswer(payload.payload);
      }
    });

    // ── Presence: Disconnect Detection ──
    channel.on('presence', { event: 'leave' }, (payload) => {
      // Opponent left — start forfeit grace period
      if (forfeitTimerRef.current) clearTimeout(forfeitTimerRef.current);
      forfeitTimerRef.current = setTimeout(() => {
        handleForfeit();
      }, MATCH_CONFIG.FORFEIT_GRACE_PERIOD * 1000);
    });

    channel.on('presence', { event: 'join' }, () => {
      // Opponent rejoined — cancel forfeit
      if (forfeitTimerRef.current) {
        clearTimeout(forfeitTimerRef.current);
        forfeitTimerRef.current = null;
      }
    });

    // ── Subscribe and Track ──
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ userId: user.id, joinedAt: new Date().toISOString() });
      }
    });

    channelRef.current = channel;

    return () => {
      if (forfeitTimerRef.current) clearTimeout(forfeitTimerRef.current);
      supabase.removeChannel(channel);
    };
  }, [battleId, user?.id]);

  return { sendAnswer, sendReady, sendNextQuestion, channel: channelRef.current };
}
