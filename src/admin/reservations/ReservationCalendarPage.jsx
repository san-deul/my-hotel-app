import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "../../styles/fullcalendar.css"

/* =========================
 * 객실별 색상 맵
 * ========================= */
const ROOM_COLORS = {
  "100": "#2563eb",
  "200": "#4ccc72",
  "300": "#f59e0b",
};

/* =========================
 * 날짜별 점유율 계산
 * ========================= */
function buildDailyOccupancy(reservations) {
  const map = {};

  reservations.forEach((r) => {
    
    let cur = dayjs(r.start_date);
    const end = dayjs(r.end_date);

    while (cur.isBefore(end)) {
      const dateKey = cur.format("YYYY-MM-DD");

      if (!map[dateKey]) {
        map[dateKey] = {};
      }

      const roomName = r.room.room_name;
      const parentName = r.room.parent_name;

      map[dateKey][roomName] = {
        count: (map[dateKey][roomName]?.count || 0) + 1,
        total: r.room.total_room,
        parent: r.room.parent_name,
      }

      cur = cur.add(1, "day");

    }

  });
  //console.log('map===>', map);
  return map;
}

export default function ReservationCalendarPage() {

  const navigate = useNavigate();

  /* =========================
   * 예약 데이터 조회
   * ========================= */
  const { data, isLoading } = useQuery({

    queryKey: ["admin-reservation-calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservation")
        .select(`
          *,
          room:room_no (
            room_name,
            parent_name,
            total_room
          )
        `)
        .neq("status", "cancelled"); // 취소 제외


      console.log('data===>', data);
      if (error) throw error;

      const occupancy = buildDailyOccupancy(data);
      console.log('occupancty==:', occupancy)

      const rooms = data.reduce((acc, r) => {
        acc[r.room.room_name] = r.room.total_room;
        //console.log('acc=-=>', acc);
        return acc;
      }, {});


      //occupancy 로 돌려야지
      const events = [];

      Object.entries(occupancy).forEach(([date, rooms]) => {
        Object.entries(rooms).forEach(([roomName, info]) => {
          events.push({
            date:date,
            id: `${date}-${roomName}`,
            title: `${roomName} (${info.count}/${info.total})`,
            start: date,
            end: dayjs(date).add(1, "day").format("YYYY-MM-DD"),
            backgroundColor:
              ROOM_COLORS[info.parent] || "#6b7280",
            borderColor:
              ROOM_COLORS[info.parent] || "#6b7280",
            extendedProps: {
              count: info.count,
              total: info.total,
              roomName,
            },
          });
        });
      });


      return { events }
    }
  })

  /* =========================
   * 날짜 셀 배경 처리
   * ========================= */
  const dayCellClassNames = (arg) => {
    const date = dayjs(arg.date).format("YYYY-MM-DD");
    const daily = data?.occupancy?.[date];
    if (!daily) return "";

    const isFull = Object.entries(daily).some(
      (info) => info.count >= info.total
    );

    return isFull ? "bg-red-50" : "";
  };

  if (isLoading) {
    return <div className="p-6">불러오는 중...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">예약 현황</h1>

      <div className="bg-white rounded shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          locale="ko"
          events={data.events}          
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          dayCellClassNames={dayCellClassNames}
          eventClick={(info) => {
            const date = dayjs(info.event.start).format("YYYY-MM-DD");
            alert(`${date}`);
            navigate(`/admin/reserve?date=${date}`);
          }}
        />
      </div>
    </div>
  );
}


