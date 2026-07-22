import { useState } from "react";
import ChatBtn from "../admin/chat/ChatBtn";
import ChatWindow from "../admin/chat/ChatWindow";

export default function ChatContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatBtn
        onClick={() => setIsOpen(true)}
        unreadCount={0}
      />

      {isOpen && (
        <ChatWindow
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}