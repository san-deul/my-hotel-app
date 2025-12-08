// src/pages/RoomDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import RoomNav from "../components/rooms/RoomNav";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);

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

      if (imgs && imgs.length > 0) {
        const imageUrls = imgs.map((img) => {
          const { data } = supabase.storage
            .from("room_images")
            .getPublicUrl(img.upload_path);
          return {
            ...img,
            publicUrl: data.publicUrl,
          };
        });

        setImages(imageUrls);
      }
    };

    load();
  }, [id]);

  if (!room)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );

  const showPrev = () => {
    setMainIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setMainIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex max-w-7xl mx-auto pt-10">
      <RoomNav />

      <div className="flex-1 px-10">

        {/* 제목 */}
        <h1 className="text-3xl font-serif mb-6">{room.room_name}</h1>

        {/* 메인 이미지 + 좌우 화살표 */}
        <div className="relative w-full h-[450px]">
          <img
            src={images[mainIndex]?.publicUrl}
            alt={room.room_name}
            className="w-full h-full object-cover rounded"
          />

          {/* 왼쪽 버튼 */}
          {images.length > 1 && (
            <button
              onClick={showPrev}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
            >
              <FiChevronLeft size={24} />
            </button>
          )}

          {/* 오른쪽 버튼 */}
          {images.length > 1 && (
            <button
              onClick={showNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
            >
              <FiChevronRight size={24} />
            </button>
          )}
        </div>

        {/* 썸네일 */}
        {images.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {images.map((img, index) => (
              <img
                key={img.room_img_no}
                src={img.publicUrl}
                onClick={() => setMainIndex(index)}
                className={`w-32 h-20 object-cover rounded cursor-pointer border-2 transition ${
                  mainIndex === index
                    ? "border-[#6d563b]"
                    : "border-gray-300 hover:border-[#6d563b]"
                }`}
              />
            ))}
          </div>
        )}

        {/* 설명 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">
            {room.info || "객실 설명이 준비 중입니다."}
          </h2>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-semibold">가격:</span>{" "}
                {room.price?.toLocaleString() || "문의"}원
              </div>

              <div>
                <span className="font-semibold">기준 인원:</span>{" "}
                {room.guest_count || "-"}명
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-6 py-3 bg-[#6d563b] text-white rounded hover:bg-[#5a4730] transition">
              예약하기
            </button>
            <button className="px-6 py-3 bg-gray-300 rounded hover:bg-gray-400 transition">
              문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
