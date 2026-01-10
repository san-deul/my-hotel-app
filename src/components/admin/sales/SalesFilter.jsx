// src/components/admin/sales/SalesFilter.jsx
import { useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SalesFilter({
  startDate,
  endDate,
  currentDate,
  rangeType,
  onToday,
  onWeek,
  onMonth,
  onMoveMonth,
  onSelectDate,
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const baseBtn = "px-4 py-2 text-sm border rounded-lg";
  const active = "bg-[#696cff] text-white border-[#696cff]";
  const inactive = "bg-white hover:bg-gray-50";

  return (
    <div className="bg-white p-4 rounded-lg border space-y-3">
      <div className="flex items-center justify-between">
        {/* 왼쪽 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={onToday}
            className={`${baseBtn} ${
              rangeType === "today" ? active : inactive
            }`}
          >
            오늘
          </button>
          <button
            onClick={onWeek}
            className={`${baseBtn} ${
              rangeType === "week" ? active : inactive
            }`}
          >
            이번주
          </button>
          <button
            onClick={onMonth}
            className={`${baseBtn} ${
              rangeType === "month" ? active : inactive
            }`}
          >
            이번달
          </button>
        </div>

        {/* 가운데 월 이동 */}
        <div className="flex items-center gap-3">
          <button onClick={() => onMoveMonth(-1)}>◀</button>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="font-semibold"
          >
            {dayjs(currentDate).format("YYYY년 M월")}
          </button>
          <button onClick={() => onMoveMonth(1)}>▶</button>
        </div>

        {/* 오른쪽 날짜 표시 */}
        <div className="text-sm text-gray-500">
          {startDate} ~ {endDate}
        </div>
      </div>

      {/* 달력 */}
      {showCalendar && (
        <div className="border rounded p-3 inline-block">
          <DatePicker
            selected={currentDate.toDate()}
            onChange={(date) => {
              onSelectDate(date);
              setShowCalendar(false);
            }}
            inline
          />
        </div>
      )}
    </div>
  );
}
