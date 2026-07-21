import { MessageCircle } from "lucide-react";

export default function ChatBtn({ onClick, unreadCount = 0 }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
    >
      <MessageCircle size={26} />

      {unreadCount >= 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
}