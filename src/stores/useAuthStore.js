import { create } from 'zustand';
import { supabase } from '../services/supabase';

/**
 * Enterprise Auth Store
 * Manages identity, Multi-Tenant scoping, RBAC metadata, and active session telemetry.
 */
export const useAuthStore = create((set, get) => ({
  // ── State ──
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  loading: true, // Legacy compatibility mapping for non-refactored imports
  error: null,

  // ── Actions ──

  /**
   * Initializes real-time persistent session listening.
   * Guarantees absolute UI profile hydration before releasing visual loading boundaries.
   */
  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      const user = session?.user ?? null;
      set({ session, user });
      
      if (user) {
        // Await profile payload hydration synchronously to prevent blank UI flickers on page refresh
        await get().fetchProfile(user.id);
      }
      
      set({ isLoading: false, loading: false });
    } catch (err) {
      console.error('Session initialization failure:', err);
      set({ isLoading: false, loading: false, error: err.message });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        set({ session, user });
        if (user) {
          await get().fetchProfile(user.id);
        } else {
          set({ profile: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  },

  /**
   * Fetches tenant-bound user profile securely.
   */
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, organizations(name, branding_color)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (err) {
      console.error('Profile network retrieval failure:', err);
    }
  },

  /**
   * Standard Password Authentication
   */
  signIn: async (email, password) => {
    set({ isLoading: true, loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ isLoading: false, loading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false, loading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Identity Provisioning with Scoped Tenant Mapping
   */
  signUp: async (email, password, username, department, role = 'Student', organizationId = null) => {
    set({ isLoading: true, loading: true, error: null });
    try {
      const metadata = { username, department, role };
      if (organizationId) metadata.organization_id = organizationId;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      set({ isLoading: false, loading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false, loading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Terminates active user session securely.
   */
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, session: null });
  },

  /**
   * Persists modified profile fields.
   */
  updateProfile: async (updates) => {
    const userId = get().user?.id;
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select('*, organizations(name, branding_color)')
        .single();
      
      if (error) throw error;
      set({ profile: data });
    } catch (err) {
      console.error('Profile database modification failure:', err);
    }
  },

  clearError: () => set({ error: null }),
}));

// Default export wrapper mapping to maintain runtime compatibility during phased refactor
export default useAuthStore;
