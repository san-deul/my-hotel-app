// src/pages/RoomDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import RoomNav from "../components/rooms/RoomNav";

export default function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: roomData } = await supabase
        .from("room")
        .select("*")
        .eq("room_no", id)
        .single();

      const { data: imgs } = await supabase
        .from("room_img")
        .select("*")
        .eq("room_no", id);

      setRoom(roomData);
      setImages(imgs);
    };
    load();
  }, [id]);

  if (!room) return <div>Loading...</div>;

  return (
    <div className="flex max-w-7xl mx-auto pt-10">
      <RoomNav />

      <div className="flex-1 px-10">
        <h1 className="text-3xl font-serif mb-6">{room.room_name}</h1>

        {/* 메인 이미지 */}
        <img
          src={images[0]?.upload_path}
          className="w-full h-[450px] object-cover rounded"
        />

        {/* 썸네일 */}
        <div className="flex gap-3 mt-4">
          {images.map((img) => (
            <img
              key={img.room_img_no}
              src={img.upload_path}
              className="w-32 h-20 object-cover rounded cursor-pointer border"
            />
          ))}
        </div>

        {/* 설명 */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">
            {room.info || "객실 설명이 준비 중입니다."}
          </h2>

          <p className="text-gray-600 text-sm">
            가격: {room.price?.toLocaleString()}원  
            <br />
            기준 인원: {room.guest_count}명  
          </p>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-[#6d563b] text-white rounded">
              예약하기
            </button>
            <button className="px-4 py-2 bg-gray-300 rounded">
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
