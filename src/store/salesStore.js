// src/store/salesStore.js
import { create } from "zustand";
import dayjs from "dayjs";

export const useSalesStore = create((set) => ({
  startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  endDate: dayjs().endOf("month").format("YYYY-MM-DD"),

  setMonth: (date) =>
    set({
      startDate: dayjs(date).startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs(date).endOf("month").format("YYYY-MM-DD"),
    }),

  setToday: () =>
    set({
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
    }),
}));
