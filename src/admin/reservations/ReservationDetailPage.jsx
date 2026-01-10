import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import dayjs from "dayjs";
import { useState } from "react";

export default function ReservationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [memo, setMemo] = useState("");

  /* =========================
   * 예약 상세 조회
   * ========================= */
  const { data: reservation, isLoading } = useQuery({
    queryKey: ["admin-reservation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservation")
        .select(`
          *,
          room:room_no (
            room_name,
            price
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      setMemo(data.memo || "");
      return data;
    },
  });

  /* =========================
   * 상태 변경
   * ========================= */
  const updateStatus = useMutation({
    mutationFn: async (status) => {
      const { error } = await supabase
        .from("reservation")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reservation", id]);
      queryClient.invalidateQueries(["admin-reservations"]);
    },
  });

  /* =========================
   * 메모 저장
   * ========================= */
  const saveMemo = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("reservation")
        .update({ memo })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      alert("메모가 저장되었습니다.");
      queryClient.invalidateQueries(["admin-reservation", id]);
    },
  });

  if (isLoading) {
    return <div className="p-6">불러오는 중...</div>;
  }

  if (!reservation) {
    return <div className="p-6">예약 정보가 없습니다.</div>;
  }


  const renderStatus = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
            확정
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
            취소
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
            대기
          </span>
        );
    }
  };

  const handleChangeStatus = (nextStatus) => {
    const message =
      nextStatus === "confirmed"
        ? "예약을 확정하시겠습니까?"
        : "예약을 취소하시겠습니까?";

    if (!window.confirm(message)) return;

    updateStatus.mutate(nextStatus);
  };


  return (
    <div className="p-6 space-y-6">
      {/* =========================
       * 상단 헤더
       * ========================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">예약 상세</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          목록
        </button>
      </div>

      {/* =========================
       * 예약 기본 정보
       * ========================= */}
      <div className="bg-white rounded shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">예약번호</p>
          <p className="font-medium">{reservation.id}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">예약 상태</p>
          <p className="font-medium">{renderStatus(reservation.status)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">예약일</p>
          <p>{dayjs(reservation.created_at).format("YYYY-MM-DD HH:mm")}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">결제 방식</p>
          <p>{reservation.payment_method || "-"}</p>
        </div>
      </div>

      {/* =========================
       * 예약자 정보
       * ========================= */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4">예약자 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p className="text-sm text-gray-500">이름</p>
            <p>{reservation.guest_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">연락처</p>
            <p>{reservation.guest_phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">이메일</p>
            <p>{reservation.guest_email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">메모</p>
            <p>{reservation.memo}</p>
          </div>
        </div>
      </div>

      {/* =========================
       * 객실 정보
       * ========================= */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4">객실 정보</h2>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">객실명</p>
            <p className="font-medium text-base">
              {reservation.room?.room_name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">체크인 ~ 체크아웃</p>
            <p className="font-medium text-base">
              {dayjs(reservation.start_date).format("YYYY-MM-DD")} ~ {dayjs(reservation.end_date).format("YYYY-MM-DD")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">인원</p>
            <p className="font-medium text-base">
              성인 {reservation.adult} / 아동 {reservation.child}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-1">총 결제 금액</p>
          <p className="text-lg font-semibold">
            {reservation.total_price.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* =========================
       * 관리자 액션
       * ========================= */}
      <div className="bg-white rounded shadow p-6 flex gap-3">
        {reservation.status === "pending" && (
          <button
            onClick={() => handleChangeStatus("confirmed")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            예약 확정
          </button>
        )}

        {reservation.status === "confirmed" && (
          <button
            onClick={() => handleChangeStatus("cancelled")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            예약 취소
          </button>
        )}
      </div>

      
    </div>
  );
}
