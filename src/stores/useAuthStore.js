import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

/**
 * Auth Store — Manages authentication state, user session, and profile data.
 */
const useAuthStore = create((set, get) => ({
  // ── State ──
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,

  // ── Actions ──

  /**
   * Initialize auth listener. Call once at app root.
   */
  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, loading: false });
      if (session?.user) {
        get().fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ session, user: session?.user ?? null });
        if (session?.user) {
          get().fetchProfile(session.user.id);
        } else {
          set({ profile: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  },

  /**
   * Fetch user profile from profiles table.
   */
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },

  /**
   * Sign in with email and password.
   */
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign up with email, password, and profile metadata.
   */
  signUp: async (email, password, username, department) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, department },
        },
      });
      if (error) throw error;
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign out.
   */
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, session: null });
  },

  /**
   * Update profile fields.
   */
  updateProfile: async (updates) => {
    const userId = get().user?.id;
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
