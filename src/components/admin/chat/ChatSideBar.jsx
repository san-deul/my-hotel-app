import { useState, useMemo } from "react";
import { Search } from "lucide-react";

const roleLabel = { admin: "관리자", manager: "매니저" };

export default function ChatSidebar({ users, selectedUser, onSelectUser }) {

  const [search, setSearch] = useState("");

  console.log('users->???',users)

  const filteredUsers = useMemo(
    () => users.filter((u) => u.name?.includes(search)),
    [users, search]
  );

  return (
    <aside className="flex w-[280px] flex-col border-r bg-gray-50">
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        관리자 채팅
      </div>

      <div className="border-b p-3">
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름으로 검색"
            className="w-full text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            검색 결과가 없습니다.
          </div>
        )}

        {filteredUsers.map((user) => {
          const isSelected = user.id === selectedUser?.id;
          return (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`flex cursor-pointer items-center gap-3 border-b px-4 py-3 transition-colors ${
                isSelected ? "bg-blue-50" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                {user.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium">{user.name}</span>
                  <span className="ml-2 flex-shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600">
                    {roleLabel[user.role] ?? user.role}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}