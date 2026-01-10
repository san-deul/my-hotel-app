import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

export default function ReservationListPage() {
  const navigate = useNavigate();

  /* =========================
   * 필터 상태
   * ========================= */

  const [searchParams] = useSearchParams();
  const queryDate = searchParams.get("date");

  const today = dayjs().format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(queryDate || today);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");


  useEffect(() => {
    if (queryDate) {
      setStartDate(queryDate);
    }
  }, [queryDate]);


  /* =========================
   * 예약 목록 조회
   * ========================= */
  const { data: reservations, isLoading } = useQuery({
    queryKey: ["admin-reservations", startDate, endDate, status, keyword],
    queryFn: async () => {
      let query = supabase
        .from("reservation")
        .select(`
          *,
          room:room_no (
            room_name
          )
        `)
        .order("start_date", { ascending: true });

      if (startDate) {
        query = query
          .gte("start_date", startDate)
      }
      if (endDate) {
        query = query.lte("end_date", endDate);
      }
      if (status) {
        query = query.eq("status", status);
      }
      if (keyword) {
        query = query.or(
          `guest_name.ilike.%${keyword}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      return data;
    },
  });

  console.log('reservations-->', reservations);


  /* =========================
   * 상태 뱃지
   * ========================= */
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">예약 관리</h1>

      {/* =========================
       * 필터 영역
       * ========================= */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">전체 상태</option>
          <option value="pending">대기</option>
          <option value="confirmed">확정</option>
          <option value="cancelled">취소</option>
        </select>

        <input
          type="text"
          placeholder="예약자명 / 전화번호"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setKeyword(keywordInput);
            }
          }}
          className="border rounded px-3 py-2 "
        />

        <button
          onClick={() => setKeyword(keywordInput)}
          className="px-4 py-2 bg-[#696cff] text-white rounded "
        >
          검색
        </button>
      </div>

      {/* =========================
       * 예약 테이블
       * ========================= */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">예약번호</th>
              <th className="px-4 py-3 text-left">예약자</th>
              <th className="px-4 py-3 text-left">객실</th>
              <th className="px-4 py-3 text-left">체크인</th>
              <th className="px-4 py-3 text-left">체크아웃</th>
              <th className="px-4 py-3 text-left">상태</th>
              <th className="px-4 py-3 text-right">금액</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  불러오는 중...
                </td>
              </tr>
            )}

            {!isLoading && reservations?.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  예약 내역이 없습니다.
                </td>
              </tr>
            )}

            {reservations?.map((r) => (
              <tr
                key={r.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  navigate(`/admin/reservations/${r.id}`)
                }
              >
                <td className="px-4 py-3">{r.id || "-"}</td>
                <td className="px-4 py-3">{r.guest_name}</td>
                <td className="px-4 py-3">{r.room?.room_name}</td>
                <td className="px-4 py-3">
                  {dayjs(r.start_date).format("YYYY-MM-DD")}
                </td>
                <td className="px-4 py-3">
                  {dayjs(r.end_date).format("YYYY-MM-DD")}
                </td>
                <td className="px-4 py-3">{renderStatus(r.status)}</td>
                <td className="px-4 py-3 text-right">
                  {r.total_price.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
