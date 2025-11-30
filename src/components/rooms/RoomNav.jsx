// src/components/rooms/RoomNav.jsx

import { Link, useLocation } from "react-router-dom";
import { useRoomsQuery } from "../../hooks/useRoomsQuery";

export default function RoomNav() {
  const { pathname } = useLocation();
  const { data: rooms, isLoading } = useRoomsQuery();


  if (!rooms) return <aside className="p-6">데이터 없음</aside>;

  // 부모(카테고리) : depth = 0
  const parents = rooms.filter((room) => room.depth === 0);

  // 자식 : depth = 1 → parent_name 으로 그룹화
  const childrenMap = rooms.reduce((acc, room) => {
    if (room.depth === 1) {
      if (!acc[room.parent_name]) acc[room.parent_name] = [];
      acc[room.parent_name].push(room);
    }
    return acc;
  }, {});

  return (
    <aside className="w-64 bg-[#f4ecd4] p-6 border-r">
      <h2 className="text-xl font-serif mb-4">객실</h2>

      {/* 부모 카테고리 반복 */}
      {parents.map((parent) => (
        <div key={parent.room_no} className="mb-6">

          {/* 카테고리 이름 */}
          <h3 className="font-semibold text-[#6d563b] mb-2">
            {parent.room_name}
          </h3>

          {/* 자식 목록 */}
          <ul className="space-y-1">
            {childrenMap[parent.room_no]?.map((child) => (
              <li key={child.room_no}>
                <Link
                  to={`/rooms/${child.room_no}`}
                  className={`block px-2 py-1 rounded ${
                    pathname.includes(String(child.room_no))
                      ? "bg-[#ede4cb] text-[#6d563b]"
                      : "text-gray-700 hover:bg-[#ede4cb]"
                  }`}
                >
                  {child.room_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
