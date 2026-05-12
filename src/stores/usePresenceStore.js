import { create } from 'zustand';
import { ACTIVITY_STATUS } from '../lib/constants';

/**
 * Presence Store — Manages online users and their activity statuses.
 */
const usePresenceStore = create((set) => ({
  // ── State ──
  onlineUsers: [],
  myStatus: ACTIVITY_STATUS.IDLE,

  // ── Actions ──

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  updateStatus: (status) => set({ myStatus: status }),

  reset: () =>
    set({
      onlineUsers: [],
      myStatus: ACTIVITY_STATUS.IDLE,
    }),
}));

export default usePresenceStore;
