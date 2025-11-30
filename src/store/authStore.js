import { create } from "zustand";
import { supabase } from "../lib/supabase";


export const useAuthStore = create((set) => ({
  user: null, 
  setUser: (user) => set({ user }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
