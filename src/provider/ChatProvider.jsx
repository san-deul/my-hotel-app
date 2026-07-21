import { useEffect } from "react";
import { getManagers, getMessages } from "../api/chat";
import useChatStore from "../store/chatStore";

export default function ChatProvider({ children }) {
  const setMessages = useChatStore((state) => state.setMessages);
  const setUsers = useChatStore((state) => state.setUsers);

  useEffect(() => {
    const init = async () => {
      try {
        const [messages, users] = await Promise.all([
          getMessages(),
          getManagers(),
        ]);

        setMessages(messages);
        setUsers(users);

        console.log("messages:", messages);
        console.log("users:", users);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, [setMessages, setUsers]);

  return <>{children}</>;
}