import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import RoomTree from "../../components/admin/rooms/RoomTree";
import RoomDetail from "../../components/admin/rooms/RoomDetail";
import AddCategoryForm from "../../components/admin/rooms/AddCategoryForm";
import AddRoomForm from "../../components/admin/rooms/AddRoomForm";
import CategoryDetail from "../../components/admin/rooms/CategoryDetail";

export default function AdminRoomPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  console.log('selectedRoom', selectedRoom)

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

        {/* 객실목록(좌) */}
        <div className="w-1/3 bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-3">객실 목록</h2>
          <RoomTree data={rooms} onRoomSelect={(room) => setSelectedRoom(room)} />
          {/* RoomTree에의해, 선택된 node값이 selectedRoom 에 들어가게됨*/}
        </div>




        {/* 객실상세(우) */}
        <div className="flex-1 bg-white p-6 shadow rounded">
          {!selectedRoom && (
            <div className="text-gray-500">객실을 선택해주세요.</div>
          )}

          {selectedRoom?.depth === 0 && (
            <CategoryDetail category={selectedRoom} />
          )}

          {selectedRoom?.depth === 1 && (
            <RoomDetail
              key={selectedRoom.room_no}
              room={selectedRoom}
            />
          )}
        </div>
      </div>
      {/* RoomDetail 에서 분기처러하면, if문 지옥 일어날것같아서 여기서 처리함 */}


      <AddCategoryForm />
      <AddRoomForm />
    </div>
  );
}
