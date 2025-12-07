import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import RoomTree from "../../components/admin/rooms/RoomTree";
import RoomDetail from "../../components/admin/rooms/RoomDetail";
import AddCategoryForm from "../../components/admin/rooms/AddCategoryForm";
import AddRoomForm from "../../components/admin/rooms/AddRoomForm";

export default function AdminRoomPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["room-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("room").select("*");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="p-6">
      <div className="flex gap-6">
        
        {/* 좌측 트리 */}
        <div className="w-1/3 bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-3">객실 목록</h2>
          <RoomTree data={rooms} onSelect={(room) => setSelectedRoom(room)} />
        </div>

        {/* 우측 상세 */}
        <div className="flex-1 bg-white p-6 shadow rounded">
          {selectedRoom ? (
            <RoomDetail key={selectedRoom.room_no} room={selectedRoom} />
          ) : (
            <div className="text-gray-500">객실을 선택해주세요.</div>
          )}
        </div>
      </div>

     
      <AddCategoryForm />
      <AddRoomForm />
    </div>
  );
}
