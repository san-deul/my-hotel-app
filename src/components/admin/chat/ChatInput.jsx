import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ disabled, onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);      // 부모(ChatWindow)로 텍스트 전달
    setInput("");        // 전송 후 입력창 비우기
  };

  return (
    <div className="flex gap-3 border-t p-4">
      <input
        disabled={disabled}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 rounded-lg border px-4 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
        placeholder={disabled ? "직원을 먼저 선택해주세요" : "메시지를 입력하세요."}
      />
      <button
        disabled={disabled}
        onClick={handleSend}
        className="flex items-center gap-1 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white disabled:bg-gray-300"
      >
        <Send size={16} />
        전송
      </button>
    </div>
  );
}