import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import ReservationBar from "../../components/reservation/ReservationBar";
import RoomSearchList from "../../components/reservation/RoomSearchList";

export default function RoomSearchPage() {
  const [params] = useSearchParams();

  const start = params.get("start");
  const end = params.get("end");
  const adult = Number(params.get("adult"));
  const child = Number(params.get("child"));

  const hasSearchParams = start && end;


  // ==========================================
  // 📌 검색된 객실 목록 + 객실 이미지 합쳐서 반환
  // ==========================================
  const { data: rooms, isLoading } = useQuery({
    queryKey: ["search-rooms", start, end, adult, child],
    queryFn: async () => {
      // 1) 객실 정보 가져오기
      const { data: roomList, error: roomErr } = await supabase
        .from("room")
        .select("*")
        .eq("depth", 1)
        .gte("guest_count", adult + child);

      if (roomErr) throw roomErr;

      // 2) 이미지 전체 가져오기
      const { data: imgList, error: imgErr } = await supabase
        .from("room_img")
        .select("*");

      if (imgErr) throw imgErr;

      // 3) 객실 + 이미지 합치기
      const combined = roomList.map((room) => {
        const filteredImgs = imgList.filter(
          (img) => img.room_no === room.room_no
        );

        const urls = filteredImgs.map((img) => {
          return supabase.storage
            .from("room_images")
            .getPublicUrl(img.upload_path).data.publicUrl;
        });

        return {
          ...room,
          images: urls,
          thumbnail: urls[0] || "/no-image.jpg",
        };
      });

      return combined;
    },
  });

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* ⭐ 검색 바 (상단 고정) */}
      <div className="border-b bg-white shadow-sm ">
        <div className="max-w-6xl mx-auto py-6">
          <ReservationBar />
        </div>
      </div>

      {/* ⭐ 검색 결과 */}
      {!hasSearchParams && (
        <div className="max-w-6xl mx-auto py-20 text-center">
          <p className="text-2xl text-gray-600 font-medium">
            예약을 원하시는 날짜, 인원을 선택해주세요.
          </p>
        </div>
      )}
      {hasSearchParams && (
        <div className="max-w-6xl mx-auto py-10">
          <h2 className="text-xl font-semibold mb-6">
            예약 가능한 객실 {rooms?.length ?? 0}개
          </h2>

          {isLoading ? (
            <div>로딩중...</div>
          ) : (
            <RoomSearchList rooms={rooms} start={start} end={end} adult={adult} child={child} />
          )}
        </div>
      )}
    </div>
  );
}
