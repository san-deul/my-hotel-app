import { useState } from "react";
import dayjs from "dayjs";

export default function RoomReservation() {
  const [openCalendar, setOpenCalendar] = useState(null); // "checkin" | "checkout"
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);

  const [adult, setAdult] = useState(2);
  const [child, setChild] = useState(0);

  const today = dayjs();
  const nextMonth = today.add(1, "month");

  const onSelectDate = (date) => {
    if (openCalendar === "checkin") {
      setCheckin(date);
      setOpenCalendar(null);
    } else if (openCalendar === "checkout") {
      if (checkin && date.isBefore(checkin)) {
        alert("체크아웃 날짜는 체크인 이후여야 합니다.");
        return;
      }
      setCheckout(date);
      setOpenCalendar(null);
    }
  };

  const renderCalendar = (month) => {
    const start = month.startOf("month").day();
    const days = month.daysInMonth();

    return (
      <div className="p-4 w-64">
        <h3 className="text-center font-medium mb-2">{month.format("YYYY.MM")}</h3>

        <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-2">
          {["일","월","화","수","목","금","토"].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 text-center">
          {Array.from({ length: start }).map((_, i) => <div key={i}></div>)}

          {Array.from({ length: days }).map((_, i) => {
            const date = month.date(i + 1);
            const isSelected =
              (checkin && date.isSame(checkin, "day")) ||
              (checkout && date.isSame(checkout, "day"));

            return (
              <button
                key={i}
                onClick={() => onSelectDate(date)}
                className={`p-2 rounded-full mx-auto
                  ${isSelected ? "bg-brown-500 text-white" : "hover:bg-gray-100"}
                `}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const search = () => {
    console.log({
      checkin: checkin?.format("YYYY-MM-DD"),
      checkout: checkout?.format("YYYY-MM-DD"),
      adult,
      child,
    });
    alert("콘솔을 확인하세요!");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">호텔 예약</h2>

      {/* 날짜 선택 영역 */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="font-medium">체크인</label>
          <div
            className="border p-3 rounded cursor-pointer"
            onClick={() => setOpenCalendar("checkin")}
          >
            {checkin ? checkin.format("YYYY-MM-DD") : "날짜 선택"}
          </div>
        </div>

        <div className="flex-1">
          <label className="font-medium">체크아웃</label>
          <div
            className="border p-3 rounded cursor-pointer"
            onClick={() => setOpenCalendar("checkout")}
          >
            {checkout ? checkout.format("YYYY-MM-DD") : "날짜 선택"}
          </div>
        </div>
      </div>

      {/* 달력 팝업 */}
      {openCalendar && (
        <div className="border rounded-xl p-4 mb-6 flex gap-4 bg-white shadow-lg">
          {renderCalendar(today)}
          {renderCalendar(nextMonth)}
        </div>
      )}

      {/* 인원 선택 */}
      <div className="border p-4 rounded mb-6">
        <h3 className="font-medium mb-3">인원</h3>

        <div className="flex justify-between mb-4">
          <span>성인</span>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 border rounded" onClick={() => setAdult(Math.max(1, adult - 1))}>-</button>
            <span>{adult}</span>
            <button className="px-3 py-1 border rounded" onClick={() => setAdult(adult + 1)}>+</button>
          </div>
        </div>

        <div className="flex justify-between">
          <span>어린이</span>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 border rounded" onClick={() => setChild(Math.max(0, child - 1))}>-</button>
            <span>{child}</span>
            <button className="px-3 py-1 border rounded" onClick={() => setChild(child + 1)}>+</button>
          </div>
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        className="w-full bg-brown-600 text-white py-3 rounded text-lg"
        onClick={search}
      >
        검색
      </button>
    </div>
  );
}
