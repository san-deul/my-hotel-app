// src/pages/admin/sales/SalesPage.jsx
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

import SalesFilter from "../../components/admin/sales/SalesFilter";
import SalesSummary from "../../components/admin/sales/SalesSummary";
import SalesChart from "../../components/admin/sales/SalesChart";
import SalesRoomOccupancyChart from "../../components/admin/sales/SalesRoomOccupancyChart";
import SalesRoomOccupancySection from "../../components/admin/sales/SalesRoomOccupancySection";

export default function SalesPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [rangeType, setRangeType] = useState("month");
  const [startDate, setStartDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );

  /* =========================
   * 기간 라벨
   * ========================= */
  const periodLabel = useMemo(() => {
    switch (rangeType) {
      case "today":
        return currentDate.format("YYYY년 M월 D일");
      case "week":
        return `${currentDate.format("YYYY년 M월")} 주간`;
      case "month":
        return currentDate.format("YYYY년 M월");
      case "custom":
        return `${dayjs(startDate).format("YYYY년 M월 D일")} ~ ${dayjs(
          endDate
        ).format("YYYY년 M월 D일")}`;
      default:
        return "매출 요약";
    }
  }, [rangeType, currentDate, startDate, endDate]);

  /* =========================
   * 필터 핸들러
   * ========================= */
  const setToday = () => {
    const today = dayjs();
    setRangeType("today");
    setCurrentDate(today);
    setStartDate(today.format("YYYY-MM-DD"));
    setEndDate(today.format("YYYY-MM-DD"));
  };

  const setWeek = () => {
    const start = currentDate.startOf("week");
    const end = currentDate.endOf("week");
    setRangeType("week");
    setStartDate(start.format("YYYY-MM-DD"));
    setEndDate(end.format("YYYY-MM-DD"));
  };

  const setMonth = () => {
    setRangeType("month");
    setStartDate(currentDate.startOf("month").format("YYYY-MM-DD"));
    setEndDate(currentDate.endOf("month").format("YYYY-MM-DD"));
  };

  const moveMonth = (direction) => {
    const next = currentDate.add(direction, "month");
    setCurrentDate(next);
    setRangeType("month");
    setStartDate(next.startOf("month").format("YYYY-MM-DD"));
    setEndDate(next.endOf("month").format("YYYY-MM-DD"));
  };

  const setCustomDate = (date) => {
    const d = dayjs(date);
    setCurrentDate(d);
    setRangeType("custom");
    setStartDate(d.format("YYYY-MM-DD"));
    setEndDate(d.format("YYYY-MM-DD"));
  };

  /* =========================
   * 매출 조회 + 차트 데이터
   * ========================= */
  const { data } = useQuery({
    queryKey: ["sales-summary", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservation")
        .select(`
          *,
          room:room_no(
            *
          )
          `)
        .gte("created_at", `${startDate} 00:00:00`)
        .lte("created_at", `${endDate} 23:59:59`);

      if (error) throw error;

      let total = 0;
      let cancelled = 0;
      let count = 0;

      const dailyMap = {};
      const roomMap = {};

      data.forEach((r) => {
        const price = Number(r.total_price) || 0;
        const date = r.created_at.slice(0, 10);

        total += price;

        if (r.status === "cancelled") {
          cancelled += price;
          return;
        }

        count += 1;

        // 일자별 매출
        dailyMap[date] = (dailyMap[date] || 0) + price;

        // 객실별 점유율
        const roomNo = r.room_no;
        const roomName = r.room.room_name;
        console.log('roomName-->', roomName)
        //roomMap[roomNo] = (roomMap[roomNo] || 0) + 1;
        roomMap[roomName] = (roomMap[roomName] || 0) + 1;

        console.log('roomMap--->', roomMap)
      });

      const dailySales = Object.entries(dailyMap).map(
        ([date, total_amount]) => ({ date, total_amount })
      );

      const roomOccupancy = Object.entries(roomMap).map(
        ([roomName, count]) => ({ roomName, count })
      );

      console.log('roomOccupancy-->',roomOccupancy)

      return {
        summary: {
          total,
          cancelled,
          net: total - cancelled,
          count,
          avg: count ? Math.round((total - cancelled) / count) : 0,
        },
        dailySales,
        roomOccupancy,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">매출관리</h1>

      <SalesFilter
        startDate={startDate}
        endDate={endDate}
        currentDate={currentDate}
        rangeType={rangeType}
        onToday={setToday}
        onWeek={setWeek}
        onMonth={setMonth}
        onMoveMonth={moveMonth}
        onSelectDate={setCustomDate}
      />

      {data && (
        <>
          <SalesSummary periodLabel={periodLabel} summary={data.summary} />

          <div className="grid grid-cols-1 gap-6">
            {/*<SalesChart data={data.dailySales} />*/}
            <div className=""></div>
            <SalesRoomOccupancySection data={data.roomOccupancy} />
          </div>
        </>
      )}
    </div>
  );
}
