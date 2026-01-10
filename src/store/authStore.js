import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { get } from "react-hook-form";


export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  setUser: async (authUser) => {
    if (!authUser) {
      set({ user: null, isLoading: false });
      return;
    }

    const state = get();
    if (state.user?.id === authUser.id) {
      set({ isLoading: false })
      return;
    }


    const { data, error } = await supabase
      .from("member")
      .select("*")
      .eq("id", authUser.id)
      .single();

    console.log("member 조회 결과:", data, error);
    if (error) {
      console.error("member 조회 에러:", error);
    }
    const role = data?.role ?? null;
    const name = data?.name ?? null;


    console.log('role은?', role);

    console.log("authUser.id:", authUser.id);
console.log("member data:", data);
console.log("member error:", error);

    set({
      user: {


        ...authUser,
        ...data,
      },
      isLoading: false,
    })
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isLoading: false });
  },
}));
