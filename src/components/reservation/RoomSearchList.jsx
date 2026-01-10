import { useNavigate } from "react-router-dom";

export default function RoomSearchList({ rooms, start, end, adult, child }) {
  const navigate = useNavigate();

  const goDetail = (room_no) => {
    navigate(`/rooms/${room_no}?start=${start}&end=${end}`);
  };

  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <div
          key={room.room_no}
          onClick={() => goDetail(room.room_no)}
          className="
            flex flex-col md:flex-row
            md:items-center md:justify-between
            bg-white border rounded-xl p-5 md:p-6
            shadow-sm cursor-pointer
            hover:shadow-md transition
            gap-5
          "
        >
          {/* 왼쪽: 이미지 + 텍스트 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <img
              src={room.thumbnail}
              alt={room.room_name}
              className="
                w-full sm:w-56 md:w-60
                h-48 sm:h-36 md:h-40
                object-cover rounded-md
              "
            />

            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {room.room_name}
                </h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base line-clamp-2">
                  {room.info}
                </p>
              </div>

              <p className="mt-3 md:mt-4 text-lg font-bold text-[#a67c52]">
                {room.price?.toLocaleString()}원 ~
              </p>
            </div>
          </div>

          {/* 오른쪽 / 하단: 예약 버튼 */}
          <button
            className="
              w-full md:w-auto
              mt-2 md:mt-0
              px-6 py-3
              bg-[#3c2b27] text-white
              rounded-lg text-center
              hover:opacity-90 transition
            "
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/reserve?room_no=${room.room_no}&start=${start}&end=${end}&adult=${adult}&child=${child}`
              );
            }}
          >
            예약하기
          </button>
        </div>
      ))}
    </div>
  );
}
