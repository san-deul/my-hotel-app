import { useState, useEffect, useMemo } from "react";
import { X, Search, Send } from "lucide-react";
import useChatStore from "../../../store/chatStore";
import { useAuthStore } from "../../../store/authStore";

import { getOrCreateRoom, getMessagesByRoom, sendMessage, getManagers } from "../../../api/chat";
import { supabase } from "../../../lib/supabase";
import ChatSidebar from "./ChatSideBar";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const roleLabel = { admin: "관리자", manager: "매니저" };

export default function ChatWindow({ onClose }) {
  const currentUser = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isLoading);

  const users = useChatStore((state) => state.users);
  const setUsers = useChatStore((state) => state.setUsers);
  const messages = useChatStore((state) => state.messages);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const currentRoom = useChatStore((state) => state.currentRoom);

  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const setCurrentRoom = useChatStore((state) => state.setCurrentRoom);
  const setMessages = useChatStore((state) => state.setMessages);
  const addMessage = useChatStore((state) => state.addMessage);



  const [search, setSearch] = useState("");


  const filteredUsers = useMemo(
    () => users.filter((u) => u.name?.includes(search)),
    [users, search]
  );

  // 유저 클릭 -> room 확보 -> 메시지 로드
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    const room = await getOrCreateRoom(currentUser.id, user.id);
    setCurrentRoom(room);
    const msgs = await getMessagesByRoom(room.id);
    setMessages(msgs);
  };

  const handleSend = async (text) => {
    if (!text.trim() || !currentRoom) return;
    await sendMessage({
      roomId: currentRoom.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      message: text,
    });
  };


  // realtime 구독 (room_id 필터)
  useEffect(() => {
    if (!currentRoom) return;

    const channel = supabase
      .channel(`room-${currentRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${currentRoom.id}`,
        },
        (payload) => {
          addMessage(payload.new);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentRoom]);

  useEffect(() => {
    if (!currentUser) return;

    const loadUsers = async () => {
      const managers = await getManagers(currentUser.id);
      setUsers(managers);
    };

    loadUsers();
  }, [currentUser]);

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div className="rounded-xl bg-white p-6 shadow-2xl">로딩중...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div className="rounded-xl bg-white p-6 shadow-2xl">로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="flex h-[650px] w-[950px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <ChatSidebar users={users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />

        <section className="flex flex-1 flex-col">
          <div className="flex h-14 items-center justify-between border-b px-5">
            <h2 className="font-semibold">{selectedUser ? selectedUser.name : "채팅방"}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <ChatMessage messages={messages} selectedUser={selectedUser} currentUserId={currentUser.id} />
          <ChatInput disabled={!selectedUser} onSend={handleSend} />
        </section>
      </div>
    </div>
  );
}