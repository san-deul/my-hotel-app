import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  /* =========================
   * Today 날짜
   * ========================= */
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todayLabel = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  /* =========================
   * Today KPI 통계
   * ========================= */
  const { data: summary, isLoading } = useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: async () => {
      const [
        checkin,
        checkout,
        confirmed,
        pending,
        cancelled,
      ] = await Promise.all([
        supabase.from("reservation").select("id", { count: "exact", head: true }) // count:exact 총 개수만 세갯다, head:true 데이터는 안가져오고 헤더만
          .eq("start_date", todayStr),

        supabase.from("reservation").select("id", { count: "exact", head: true })
          .eq("end_date", todayStr),

        supabase.from("reservation").select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .gte("created_at", `${todayStr} 00:00:00`)
          .lte("created_at", `${todayStr} 23:59:59`),

        supabase.from("reservation").select("id", { count: "exact", head: true })
          .eq("status", "pending")
          .gte("created_at", `${todayStr} 00:00:00`)
          .lte("created_at", `${todayStr} 23:59:59`),

        supabase.from("reservation").select("id", { count: "exact", head: true })
          .eq("status", "cancelled")
          .gte("created_at", `${todayStr} 00:00:00`)
          .lte("created_at", `${todayStr} 23:59:59`),
      ]);

      return {
        checkin: checkin.count || 0,
        checkout: checkout.count || 0,
        confirmed: confirmed.count || 0,
        pending: pending.count || 0,
        cancelled: cancelled.count || 0,
      };
    },
  });

  /* =========================
   * 오늘 입실 / 퇴실 리스트 (최대 3개)
   * ========================= */
  const { data: todayList } = useQuery({
    queryKey: ["admin-dashboard-today-list"],
    queryFn: async () => {
      const [checkin, checkout] = await Promise.all([
        supabase
          .from("reservation")
          .select(`
            id,
            guest_name,
            guest_phone,
            room:room_no ( room_name )
          `)
          .eq("start_date", todayStr)
          .order("created_at")
          .limit(3),

        supabase
          .from("reservation")
          .select(`
            id,
            guest_name,
            guest_phone,
            room:room_no ( room_name )
          `)
          .eq("end_date", todayStr)
          .order("created_at")
          .limit(3),
      ]);

      console.log('todayList-->',todayList);

      return {
        checkin: checkin.data || [],
        checkout: checkout.data || [],
      };
    },
  });

  if (isLoading) {
    return <div className="p-6">로딩중...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* =========================
       * Today KPI Bar
       * ========================= */}
      <section className="bg-white rounded-xl shadow py-8">
        <div className="text-center mb-6">
          <p className="text-sm text-blue-500 font-medium">Today</p>
          <h2 className="text-2xl font-bold">{todayLabel}</h2>
        </div>

        <div className="grid grid-cols-5 divide-x">
          <SummaryItem label="오늘 입실" value={summary.checkin} />
          <SummaryItem label="오늘 퇴실" value={summary.checkout} />
          <SummaryItem label="예약 완료" value={summary.confirmed} />
          <SummaryItem label="예약 대기" value={summary.pending} />
          <SummaryItem label="예약 취소" value={summary.cancelled} />
        </div>
      </section>

      {/* =========================
       * 오늘 입실 / 오늘 퇴실
       * ========================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTable
          title="오늘 입실"
          rows={todayList?.checkin}
          emptyText="오늘 입실 예정이 없습니다."
          onMore={() => navigate(`/admin/reservations?type=checkin&date=${todayStr}`)}
          timeLabel="15:00"
        />

        <TodayTable
          title="오늘 퇴실"
          rows={todayList?.checkout}
          emptyText="오늘 퇴실 예정이 없습니다."
          onMore={() => navigate(`/admin/reservations?type=checkout&date=${todayStr}`)}
          timeLabel="11:00"
        />
      </section>

    </div>
  );
}

/* =========================
 * KPI Item
 * ========================= */
function SummaryItem({ label, value }) {
  return (
    <div className="text-center">
      <p
        className={`text-4xl font-bold ${
          value === 0 ? "text-gray-300" : "text-gray-800"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-gray-500">{label}</p>
    </div>
  );
}

/* =========================
 * Today Table
 * ========================= */
function TodayTable({ title, rows = [], emptyText, onMore, timeLabel }) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="font-semibold">{title}</h3>
        <button
          onClick={onMore}
          className="text-sm text-blue-500 hover:underline cursor-pointer"
        >
          더보기 &gt;
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="py-2 px-3 text-left">시간</th>
            <th className="py-2 px-3 text-left">객실명</th>
            <th className="py-2 px-3 text-left">예약자</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-center text-gray-400">
                {emptyText}
              </td>
            </tr>
          )}

          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="py-3 px-3">{timeLabel}</td>
              <td className="py-3 px-3">{row.room?.room_name || "-"}</td>
              <td className="py-3 px-3">
                <div>{row.guest_name}</div>
                <div className="text-xs text-gray-400">
                  {row.guest_phone}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
