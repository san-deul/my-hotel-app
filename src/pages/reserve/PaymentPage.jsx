import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

/* =========================
 * PaymentPage
 * ========================= */
export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const roomNo = Number(params.get("room_no"));
  const start = params.get("start");
  const end = params.get("end");
  const adult = Number(params.get("adult"));
  const child = Number(params.get("child"));

  const customer = location.state?.customer;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
   * 필수 데이터 없으면 차단
   * ========================= */
  useEffect(() => {
    if (!roomNo || !start || !end || !customer) {
      alert("잘못된 접근입니다.");
      navigate("/");
    }
  }, []);

  /* =========================
   * 객실 정보 로드
   * ========================= */
  useEffect(() => {
    const loadRoom = async () => {
      const { data, error } = await supabase
        .from("room")
        .select("*")
        .eq("room_no", roomNo)
        .single();

      if (error) {
        alert("객실 정보를 불러오지 못했습니다.");
        navigate("/");
        return;
      }

      setRoom(data);
    };

    loadRoom();
  }, [roomNo]);

  /* =========================
   * 예약 가능 여부 체크
   * ========================= */
  const checkAvailability = async () => {
    const { count, error } = await supabase
      .from("reservation")
      .select("id", { count: "exact", head: true })
      .eq("room_no", roomNo)
      .in("status", ["pending", "confirmed"])
      .lt("start_date", end)
      .gt("end_date", start);

    if (error) throw error;

    return room.total_room - count;
  };

  /* =========================
   * 결제 + 예약 처리
   * ========================= */
  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1️⃣ 예약 가능 여부 최종 체크
      const available = await checkAvailability();

      if (available <= 0) {
        alert("선택하신 날짜에는 예약 가능한 객실이 없습니다.");
        navigate(-1);
        return;
      }

      // 로그인 사용자
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 2️⃣ reservation INSERT (pending)
      const { data: reservation, error: insertError } = await supabase
        .from("reservation")
        .insert({
          user_id: user?.id ?? null,
          room_no: roomNo,
          start_date: start,
          end_date: end,
          adult,
          child,
          total_price: room.price,
          status: "pending",
          payment_method: "card",
          guest_name: customer.name,
          guest_phone: customer.phone,
          guest_email: customer.email,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // =========================
      // 🔥 실제 서비스에서는 여기서 PG 결제 요청
      // =========================

      // 3️⃣ 결제 성공 처리 (임시)
      const { error: confirmError } = await supabase
        .from("reservation")
        .update({ status: "confirmed" })
        .eq("id", reservation.id);

      if (confirmError) throw confirmError;

      alert("예약이 완료되었습니다!");

      navigate("/myReservation");
    } catch (err) {
      console.error(err);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <div className="p-10">로딩중...</div>;

  return (
    <div className="max-w-3xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8">결제 확인</h1>

      <div className="bg-white border rounded-xl p-6 shadow space-y-4">
        <div>
          <strong>객실명</strong> : {room.room_name}
        </div>
        <div>
          <strong>숙박기간</strong> : {start} ~ {end}
        </div>
        <div>
          <strong>인원</strong> : 성인 {adult} / 아동 {child}
        </div>
        <div>
          <strong>예약자</strong> : {customer.name}
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>총 결제금액</span>
          <span>{room.price.toLocaleString()}원</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-[#3c2b27] text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-50"
        >
          {loading ? "결제 처리 중..." : "결제 확정"}
        </button>
      </div>
    </div>
  );
}
