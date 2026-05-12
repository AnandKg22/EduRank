import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import usePresenceStore from '../stores/usePresenceStore';
import useAuthStore from '../stores/useAuthStore';

/**
 * usePresence — Tracks online users via Supabase Realtime Presence.
 * Syncs online user list to the presence store.
 */
export default function usePresence() {
  const channelRef = useRef(null);
  const profile = useAuthStore((s) => s.profile);
  const myStatus = usePresenceStore((s) => s.myStatus);
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);

  useEffect(() => {
    if (!profile) return;

    const channel = supabase.channel('lobby', {
      config: {
        presence: { key: profile.id },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.entries(state).map(([key, presences]) => ({
          userId: key,
          ...presences[0],
        }));
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            username: profile.username,
            department: profile.department,
            elo_rating: profile.elo_rating,
            tier: profile.tier,
            avatar_url: profile.avatar_url,
            activity: myStatus,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  // Update presence when status changes
  useEffect(() => {
    if (channelRef.current && profile) {
      channelRef.current.track({
        username: profile.username,
        department: profile.department,
        elo_rating: profile.elo_rating,
        tier: profile.tier,
        avatar_url: profile.avatar_url,
        activity: myStatus,
        online_at: new Date().toISOString(),
      });
    }
  }, [myStatus]);

  return channelRef.current;
}
