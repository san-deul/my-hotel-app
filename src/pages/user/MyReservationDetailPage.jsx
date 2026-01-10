import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";

export default function MyReservationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  /* =========================
   * 예약 상세 조회
   * ========================= */
  const { data: reservation, isLoading } = useQuery({
    queryKey: ["reservation-detail", id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservation")
        .select(`
          id,
          start_date,
          end_date,
          status,
          total_price,
          order_no,
          payment_method,
          memo,
          created_at,
          room:room_no (
            room_name,
            room_no,
            price,
            room_img(
              upload_path,
              is_main
            )
          )
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;



      const imgs = data.room?.room_img ?? [];

      const room_img = imgs.map((img) => {
        const { data: imgData } = supabase.storage
          .from("room_images")
          .getPublicUrl(img.upload_path);

        return { ...img, publicUrl: imgData.publicUrl };
      });

      return {
        ...data,
        room: {
          ...data.room,
          room_img,
        },
      };
    },
  });


  /* =========================
    * 예약 취소
    * ========================= */
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("reservation")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      alert("예약이 취소되었습니다.");
      navigate("/mypage/reservations");
    },
  });

  if (isLoading) {
    return <div className="p-6 text-center">로딩중...</div>;
  }

  if (!reservation) {
    return <div className="p-6 text-center">예약 정보가 없습니다.</div>;
  }

  const mainImage =
    reservation.room?.room_img?.find((img) => img.is_main)?.publicUrl ||
    reservation.room?.room_img?.[0]?.publicUrl ||
    "/no-image.png";



  const statusLabel = {
    pending: "예약대기",
    confirmed: "예약확정",
    completed: "이용완료",
    cancelled: "취소",
  };

  const statusColor = {
    pending: "bg-gray-100 text-gray-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };



  const nights =
    (new Date(reservation.end_date) -
      new Date(reservation.start_date)) /
    (1000 * 60 * 60 * 24);



  const handleReReserve = () => {
    navigate(
      `/reserve?room_no=${reservation.room.room_no}` +
      `&start=${reservation.start_date}` +
      `&end=${reservation.end_date}`
    );
  };


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">예약 상세</h1>

      {/* =========================
       * 예약 요약
       * ========================= */}
      <div className="border rounded-xl overflow-hidden bg-white flex h-40 mb-6">
        {/* 왼쪽 */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              <Link to={`/rooms/${reservation.room?.room_no}`}>
                {reservation.room?.room_name}
              </Link>
              <span
                className={`px-3 py-1 text-sm rounded-full ${statusColor[reservation.status]}`}
              >
                {statusLabel[reservation.status]}
              </span>
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {reservation.start_date} ~ {reservation.end_date} · {nights}박
            </p>

            <p className="text-xs text-gray-400 mt-1">
              예약번호 : {reservation.id}
            </p>
          </div>
        </div>

        {/* 오른쪽 이미지 */}
        <div className="w-1/2 relative">
          <Link to={`/rooms/${reservation.room?.room_no}`}>
            <img
              src={mainImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </Link>

        </div>
      </div>


      {/* =========================
       * 예약자 정보
       * ========================= */}
      <div className="border rounded-xl p-6 mb-6 bg-white">
        <h3 className="font-semibold mb-4">예약자 정보</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">예약자</p>
            <p>{user?.name || "회원"}</p>
          </div>

          <div>
            <p className="text-gray-500">요청사항</p>
            <p>{reservation.memo || "-"}</p>
          </div>
        </div>
      </div>

      {/* =========================
       * 결제 정보
       * ========================= */}
      <div className="border rounded-xl p-6 bg-white">
        <h3 className="font-semibold mb-4">결제 정보</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">결제금액</p>
            <p className="font-semibold">
              {reservation.total_price.toLocaleString()}원
            </p>
          </div>

          <div>
            <p className="text-gray-500">결제수단</p>
            <p>{reservation.payment_method || "card"}</p>
          </div>

          <div>
            <p className="text-gray-500">결제일시</p>
            <p>
              {new Date(reservation.created_at).toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* =========================
        * 하단 버튼
        * ========================= */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          onClick={() => navigate("/myReservation")}
        >
          목록으로
        </button>

        {/* 예약 확정 → 취소 가능 */}
        {reservation.status === "confirmed" && (
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={() => {
              const message = `${reservation.start_date} ${reservation.room?.room_name} 예약을 정말 취소하시겠습니까?`;

              if (window.confirm(message)) {
                cancelMutation.mutate();
              }
            }}
          >
            예약 취소
          </button>
        )}

        {/* 취소 상태 → 재예약 */}
        {reservation.status === "cancelled" && (
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleReReserve}
          >
            재예약
          </button>
        )}



      </div>

    </div>
  );
}
