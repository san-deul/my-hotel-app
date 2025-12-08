import { create } from "zustand";

// 헤더 관리 상태를 저장하는 전역공간
export const useHeaderStore = create((set) => ({
  open: false,
  isScrolled: false,
  isHovered: false,

  setOpen: (value) => set({ open: value }),
  setIsScrolled: (value) => set({ isScrolled: value }),
  setIsHovered: (value) => set({ isHovered: value }),
}));
