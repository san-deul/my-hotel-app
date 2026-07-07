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

    try {
      const { data, error } = await supabase
        .from("member")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.error("member 조회 에러:", error);
      }

      set({
        user: { ...authUser, ...data }, 
        isLoading: false,
      });

    } catch (err) {
      console.error("member 조회 실패 (DB 연결 안 됨):", err);
      set({
        user: authUser,
        isLoading: false,
      });
    }

    // const role = data?.role ?? null;
    // const name = data?.name ?? null;
    /*
    set({
      user: {


        ...authUser,
        ...data,
      },
      isLoading: false,
    })
      */
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isLoading: false });
  },
}));
