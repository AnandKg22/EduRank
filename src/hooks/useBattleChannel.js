import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import useGameStore from '../stores/useGameStore';
import useAuthStore from '../stores/useAuthStore';
import { MATCH_CONFIG } from '../lib/constants';

/**
 * useBattleChannel — Manages the real-time battle communication channel.
 * Handles Broadcast (answer exchange), Presence (sync/disconnect detection),
 * and dynamic connection state monitoring.
 */
export default function useBattleChannel(battleId) {
  const [channel, setChannel] = useState(null);
  const [opponentConnected, setOpponentConnected] = useState(false);
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

    const newChannel = supabase.channel(`battle:${battleId}`, {
      config: {
        presence: { key: user.id },
      },
    });

    // ── Broadcast: Answer Exchange ──
    newChannel.on('broadcast', { event: 'answer' }, (payload) => {
      if (payload.payload.userId !== user.id) {
        syncOpponentAnswer(payload.payload);
      }
    });

    // ── Broadcast: Ready Handshake Fallback ──
    newChannel.on('broadcast', { event: 'ready' }, (payload) => {
      if (payload.payload?.userId && payload.payload.userId !== user.id) {
        setOpponentConnected(true);
      }
    });

    // ── Presence: State Synchronization ──
    newChannel.on('presence', { event: 'sync' }, () => {
      const state = newChannel.presenceState();
      const activeUsers = Object.keys(state);
      if (activeUsers.some((id) => id !== user.id)) {
        setOpponentConnected(true);
      }
    });

    newChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
      if (newPresences.some((p) => p.key !== user.id || p.userId !== user.id)) {
        setOpponentConnected(true);
        if (forfeitTimerRef.current) {
          clearTimeout(forfeitTimerRef.current);
          forfeitTimerRef.current = null;
        }
      }
    });

    newChannel.on('presence', { event: 'leave' }, () => {
      // Opponent left — start forfeit grace period
      if (forfeitTimerRef.current) clearTimeout(forfeitTimerRef.current);
      forfeitTimerRef.current = setTimeout(() => {
        handleForfeit();
      }, MATCH_CONFIG.FORFEIT_GRACE_PERIOD * 1000);
    });

    // ── Subscribe and Track ──
    newChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setChannel(newChannel);
        channelRef.current = newChannel;
        await newChannel.track({ userId: user.id, joinedAt: new Date().toISOString() });
      }
    });

    return () => {
      if (forfeitTimerRef.current) clearTimeout(forfeitTimerRef.current);
      supabase.removeChannel(newChannel);
    };
  }, [battleId, user?.id]);

  return { sendAnswer, sendReady, sendNextQuestion, channel, opponentConnected };
}
