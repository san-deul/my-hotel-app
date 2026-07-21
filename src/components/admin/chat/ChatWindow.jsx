
import { X } from "lucide-react";
import useChatStore from "../../../store/chatStore";
import { getMessagesByRoom, getOrCreateRoom } from "../../../api/chat";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";





export default function ChatWindow({ onClose }) {

  const currentUser = useAuthStore((state) => state.user);


  const users = useChatStore((state) => state.users);

  const messages = useChatStore((state) => state.messages);
  const selectedUser = useChatStore((state) => state.selectedUser);

  const currentRoom = useChatStore((state) => state.currentRoom);

  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const setCurrentRoom = useChatStore((state) => state.setCurrentRoom);
  const setMessages = useChatStore((state) => state.setMessages);
  const addMessage = useChatStore((state) => state.addMessage);

  const [input, setInput] = useState("");

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    const room = await getOrCreateRoom(currentUser.id, user.id);
    setCurrentRoom(room);
    const msgs = await getMessagesByRoom(room.id);
    setMessages(msgs);
  };

  const handleSend = async () => {
    if (!input.trim() || !currentRoom) return;
    await sendMessage({
      roomId: currentRoom.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      message: input,
    });
    setInput("");

  };

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




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="flex h-[650px] w-[950px] overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Sidebar */}
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 hover:bg-gray-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                {user.name?.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <section className="flex flex-1 flex-col">
          <div className="flex h-14 items-center justify-between border-b px-5">
            <h2 className="font-semibold">
              {selectedUser ? `${selectedUser.name}님과의 채팅` : "채팅방"}
            </h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* ⬇️⬇️⬇️ 7번: 메시지 렌더링 —*/}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 flex ${msg.sender_id === currentUser.id ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[60%] rounded-lg px-3 py-2 text-sm ${msg.sender_id === currentUser.id
                    ? "bg-blue-600 text-white"
                    : "border bg-white"
                    }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          {/* ⬆️⬆️⬆️  */}

          {/* Input */}
          <div className="flex gap-3 border-t p-4">
            <input
              className="flex-1 rounded border px-4"
              placeholder="메세지를 입력하세요."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="rounded bg-blue-600 px-6 text-white"
              onClick={handleSend}
            >
              전송
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}