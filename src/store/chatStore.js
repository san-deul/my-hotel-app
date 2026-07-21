import { create } from "zustand";

const useChatStore = create((set) => ({
  messages: [],
  users: [],
  isOpen: false,
  selectedUser: null,
  currentRoom: null,

  setMessages: (messages) =>
    set({
      messages,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setSelectedUser: (user) => set({ selectedUser: user }),
  setCurrentRoom: (room) => set({ currentRoom: room }),


  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  setUsers: (users) => set({ users }),
}));

export default useChatStore;