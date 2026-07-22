

export default function ChatMessage({ messages, selectedUser, currentUserId }) {
  if (!selectedUser) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 text-sm text-gray-400">
        대화할 직원을 선택해주세요.
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 text-sm text-gray-400">
        아직 메시지가 없습니다. 첫 메시지를 보내보세요.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
      <div className="flex flex-col gap-3">
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[65%] rounded-2xl px-4 py-2 text-sm ${
                  isMine ? "rounded-br-sm bg-blue-600 text-white" : "rounded-bl-sm border bg-white"
                }`}
              >
                {msg.message}
              </div>
              <span className="mt-1 px-1 text-[11px] text-gray-400">
                {new Date(msg.created_at).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}