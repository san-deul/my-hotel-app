import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

import { DateRange } from "react-date-range";
import { differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import Pagination from "../../components/common/Pagination";

const PAGE_SIZE = 5;

export default function MyReservationPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* =========================
   * 날짜 상태
   * ========================= */
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(today.getMonth() + 1);

  const [range, setRange] = useState([
    {
      startDate: today,
      endDate: oneMonthLater,
      key: "selection",
    },
  ]);

  const startDate = range[0].startDate;
  const endDate = range[0].endDate;

  const from = startDate.toISOString().split("T")[0];
  const to = endDate.toISOString().split("T")[0];

  /* =========================
   * 필터 상태
   * ========================= */
  const [openCalendar, setOpenCalendar] = useState(false);
  const [orderNoInput, setOrderNoInput] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const calendarRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setOpenCalendar(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* =========================
   * 예약 조회
   * ========================= */
  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["my-reservations", from, to],
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
          room:room_no (
            room_no,
            room_name,
            price,
            room_img(upload_path)
          )
        `)
        .eq("user_id", user.id)
        .gte("start_date", from)
        .lte("end_date", to)
        .order("start_date", { ascending: false });

      if (error) throw error;

      return data.map((r) => ({
        ...r,
        room: {
          ...r.room,
          room_img: r.room?.room_img?.map((img) => {
            const { data } = supabase.storage
              .from("room_images")
              .getPublicUrl(img.upload_path);
            return { ...img, publicUrl: data.publicUrl };
          }),
        },
      }));
    },
  });

  /* =========================
   * 예약번호 필터
   * ========================= */
  const filteredReservations = useMemo(() => {
    if (!orderNo.trim()) return reservations;

    return reservations.filter((r) =>
      String(r.order_no || r.id).includes(orderNo)
    );
  }, [reservations, orderNo]);

  /* =========================
   * 날짜 기준 그룹핑
   * ========================= */
  const groups = useMemo(() => {
    const grouped = filteredReservations.reduce((acc, r) => {
      const key = `${r.start_date}_${r.end_date}`;
      if (!acc[key]) {
        acc[key] = {
          start_date: r.start_date,
          end_date: r.end_date,
          total_price: 0,
          items: [],
        };
      }
      acc[key].items.push(r);
      acc[key].total_price += r.total_price;
      return acc;
    }, {});
    return Object.values(grouped);
  }, [filteredReservations]);

  /* =========================
   * 페이지네이션
   * ========================= */
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * PAGE_SIZE;
  const pagedGroups = groups.slice(startIndex, startIndex + PAGE_SIZE);

  /* =========================
   * 빠른 기간
   * ========================= */
  const applyRange = (months) => {
    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + months);
    setRange([{ startDate: start, endDate: end, key: "selection" }]);
    setPage(1);
  };

  /* =========================
   * 취소 로직
   * ========================= */
  const cancelByIds = async (ids) => {
    await supabase
      .from("reservation")
      .update({ status: "cancelled" })
      .in("id", ids)
      .eq("user_id", user.id);

    queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
  };

  /* =========================
   * 렌더
   * ========================= */
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">나의 예약 확인</h1>

      {/* =========================
       * 필터 영역
       * ========================= */}
      <div className="bg-white border rounded p-4 space-y-4">
        {/* 날짜 */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* 모바일 */}
          <div className="flex gap-2 md:hidden">
            <button className="flex-1 border py-2 rounded" onClick={() => applyRange(6)}>
              최근 6개월
            </button>
            <button className="flex-1 border py-2 rounded" onClick={() => applyRange(12)}>
              최근 1년
            </button>
            <button
              className="flex-1 border py-2 rounded"
              onClick={() => setOpenCalendar(true)}
            >
              기간 선택
            </button>
          </div>

          {/* PC */}
          <div className="hidden md:flex gap-3 items-center">
            <div
              className="cursor-pointer border px-4 py-2 rounded"
              onClick={() => setOpenCalendar(!openCalendar)}
            >
              {from} ~ {to}
            </div>
            <button className="border px-4 py-2 rounded" onClick={() => applyRange(6)}>
              최근 6개월
            </button>
            <button className="border px-4 py-2 rounded" onClick={() => applyRange(12)}>
              최근 1년
            </button>
          </div>
        </div>

        {/* 상태 + 예약번호 */}
        <div className="flex flex-col md:flex-row gap-3 md:justify-end">
          <select
            disabled
            className="border px-3 py-2 rounded bg-gray-100 text-gray-500"
          >
            <option>예약상태 전체</option>
          </select>

          <div className="flex gap-2">
            <input
              value={orderNoInput}
              onChange={(e) => setOrderNoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setOrderNo(orderNoInput);
                  setPage(1);
                }
              }}
              placeholder="예약번호 입력"
              className="border px-3 py-2 rounded w-full md:w-48"
            />
            <button
              className="border px-4 py-2 rounded"
              onClick={() => {
                setOrderNo(orderNoInput);
                setPage(1);
              }}
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 캘린더 */}
      {openCalendar && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute bottom-0 w-full bg-white rounded-t-xl">
            <DateRange
              locale={ko}
              ranges={range}
              onChange={(item) => setRange([item.selection])}
              months={1}
              direction="vertical"
              minDate={new Date()}
            />
            <div className="p-4">
              <button
                className="w-full bg-[#a67c52] text-white py-3 rounded"
                onClick={() => setOpenCalendar(false)}
              >
                조회하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
       * 카드 리스트
       * ========================= */}
      {isLoading && <div className="text-center py-10">로딩중...</div>}

      {!isLoading && pagedGroups.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          조회된 예약이 없습니다.
        </div>
      )}

      <div className="space-y-6">
        {pagedGroups.map((g) => (
          <div key={g.start_date} className="border rounded-xl bg-white">
            {/* 그룹 헤더 */}
            <div className="p-4 border-b flex justify-between">
              <div>
                <p className="font-semibold">
                  {g.start_date} ~ {g.end_date}
                </p>
                <p className="text-sm text-gray-500">
                  {differenceInDays(
                    new Date(g.end_date),
                    new Date(g.start_date)
                  )}박
                </p>
              </div>
              <div className="font-semibold text-[#a67c52]">
                ₩{g.total_price.toLocaleString()}
              </div>
            </div>

            {/* 예약 카드 */}
            <div className="divide-y">
              {g.items.map((r) => (
                <div
                  key={r.id}
                  className={`p-4 flex flex-col md:flex-row gap-4 ${
                    r.status === "cancelled" ? "opacity-60" : ""
                  }`}
                >
                  <img
                    src={r.room?.room_img?.[0]?.publicUrl || "/no-image.png"}
                    className="w-full md:w-32 h-40 md:h-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <p className="font-semibold">{r.room?.room_name}</p>
                    <p className="text-sm text-gray-500">
                      예약번호: {r.order_no || r.id}
                    </p>
                    <p className="text-sm">
                      ₩{r.room?.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex md:flex-col gap-3">
                    <button
                      className="text-blue-600"
                      onClick={() => navigate(`/reservations/${r.id}`)}
                    >
                      상세보기
                    </button>
                    {r.status !== "cancelled" && (
                      <button
                        className="text-red-500"
                        onClick={() => cancelByIds([r.id])}
                      >
                        예약취소
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Pagination
        total={groups.length}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  );
}
