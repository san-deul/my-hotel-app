// src/admin/reservations/TodayReservationPage.jsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import Pagination from "../../components/common/Pagination";

const PAGE_SIZE = 15;

export default function TodayReservationPage({ mode }) {
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [page, setPage] = useState(1);

  const dateStr = currentDate.toISOString().slice(0, 10);

  // ============================
  // 📌 체크인/체크아웃 모드 설정
  // ============================
  const isCheckin = mode === "checkin";

  const column = isCheckin ? "start_date" : "end_date";
  const statuses = isCheckin
    ? ["confirmed", "checked_in"]
    : ["checked_in", "checked_out"];

  const nextStatus = isCheckin ? "checked_in" : "checked_out";

  // ============================
  // 📌 날짜 이동
  // ============================
  const moveDate = (diff) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + diff);
    setCurrentDate(next);
    setPage(1);
  };

  // ============================
  // 📌 데이터 로드
  // ============================
  const { data, isLoading } = useQuery({
    queryKey: ["today-reservation", mode, dateStr, page],
    queryFn: async () => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, count, error } = await supabase
        .from("reservation")
        .select(
          `
          id,
          room_no,
          guest_name,
          guest_phone,
          memo,
          status
        `,
          { count: "exact" }
        )
        .eq(column, dateStr)
        .in("status", statuses)
        .order("room_no")
        .range(from, to);

      if (error) throw error;

      return {
        rows: data,
        total: count,
      };
    },
  });

  const reservations = data?.rows || [];
  const totalCount = data?.total || 0;

  // ============================
  // 📌 상태 업데이트
  // ============================
  const handleUpdate = async () => {
    if (selectedIds.length === 0) {
      alert(
        isCheckin ? "체크인할 예약을 선택해주세요." : "체크아웃할 예약을 선택해주세요."
      );
      return;
    }

    await supabase
      .from("reservation")
      .update({
        status: nextStatus,
        [isCheckin ? "checkin_at" : "checkout_at"]: new Date().toISOString(),
      })
      .in("id", selectedIds);

    setSelectedIds([]);
    queryClient.invalidateQueries(["today-reservation"]);
  };

  if (isLoading) return <div>로딩중...</div>;

  // ============================
  // 📌 UI
  // ============================
  return (
    <div className="space-y-6">

      {/* 날짜 헤더 */}
      <div className="flex justify-center items-center gap-6">
        <button onClick={() => moveDate(-1)} className="text-xl">‹</button>
        <h1 className="text-xl font-bold">
          {isCheckin ? "체크인" : "체크아웃"} : {dateStr}
        </h1>
        <button onClick={() => moveDate(1)} className="text-xl">›</button>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          className={`px-4 py-2 rounded text-white ${
            isCheckin ? "bg-blue-600" : "bg-red-600"
          }`}
        >
          선택 {isCheckin ? "체크인" : "체크아웃"}
        </button>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={() =>
                    setSelectedIds(
                      selectedIds.length === reservations.length
                        ? []
                        : reservations.map((r) => r.id)
                    )
                  }
                />
              </th>
              <th className="p-3">객실번호</th>
              <th className="p-3">예약자</th>
              <th className="p-3">연락처</th>
              <th className="p-3">메모</th>
              <th className="p-3">상태</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-t text-center">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(r.id)
                          ? prev.filter((id) => id !== r.id)
                          : [...prev, r.id]
                      )
                    }
                  />
                </td>
                <td className="p-3">{r.room_no}</td>
                <td className="p-3">{r.guest_name}</td>
                <td className="p-3 text-gray-500">{r.guest_phone}</td>
                <td className="p-3">{r.memo}</td>

                {/* 상태 표시 */}
                <td className="p-3">
                  {r.status === "checked_in" && (
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                      체크인 완료
                    </span>
                  )}
                  {r.status === "confirmed" && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                      입실 대기
                    </span>
                  )}
                  {r.status === "checked_out" && (
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                      체크아웃 완료
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 요약 */}
      <div className="text-sm text-gray-600">
        전체: {reservations.length}건
      </div>

      {/* 페이지네이션 */}
      <Pagination
        total={totalCount}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  );
}
