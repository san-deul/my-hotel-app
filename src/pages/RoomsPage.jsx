// src/pages/RoomsPage.jsx
import RoomNav from "../components/rooms/RoomNav";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("room")
        .select("*")
        .order("room_no");
      setRooms(data);
    };
    load();
  }, []);

  // depth = 0 은 대표, depth = 1 은 실제 객실
  const categories = rooms.filter((r) => r.depth === 0);
  const roomItems = rooms.filter((r) => r.depth === 1);

  return (
    <div className="flex max-w-7xl mx-auto pt-10">
      <RoomNav />

      <div className="flex-1 px-10">
        <h1 className="text-4xl font-serif mb-6">객실</h1>

        {categories.map((cat) => (
          <section key={cat.room_no} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{cat.room_name}</h2>

            <div className="grid grid-cols-2 gap-8">
              {roomItems
                .filter((d) => d.parent_name === String(cat.room_no))
                .map((room) => (
                  <div key={room.room_no}>
                    <Link to={`/rooms/${room.room_no}`}>
                      <img
                        src={
                          room.preview_img ||
                          "https://via.placeholder.com/600x400"
                        }
                        className="w-full h-60 object-cover rounded"
                      />
                    </Link>

                    <div className="mt-3">
                      <h3 className="text-xl font-semibold">
                        {room.room_name}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {room.info}
                      </p>

                      <div className="mt-3 flex gap-3">
                        <Link
                          to={`/rooms/${room.room_no}`}
                          className="px-4 py-2 bg-[#6d563b] text-white rounded"
                        >
                          예약하기
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
