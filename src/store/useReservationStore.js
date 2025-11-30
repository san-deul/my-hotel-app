import { create } from "zustand";
import { addDays } from "date-fns";

export const useReservationStore = create((set) => ({
  // 날짜 선택
  range: [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ],
  setRange: (newRange) => set({ range: [newRange] }),

  // 인원 선택
  adult: 2,
  child: 0,
  setAdult: (num) => set({ adult: num }),
  setChild: (num) => set({ child: num }),

  // UI 열림/닫힘 상태
  openCalendar: false,
  openGuests: false,
  setOpenCalendar: (bool) => set({ openCalendar: bool }),
  setOpenGuests: (bool) => set({ openGuests: bool }),
}));
