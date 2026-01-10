import { useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { differenceInDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ko } from "date-fns/locale";
import { useReservationStore } from "../../store/useReservationStore";
import { useNavigate } from "react-router-dom";
import "../../styles/date-range-override.css";

export default function ReservationBar() {
  const {
    range,
    setRange,
    adult,
    setAdult,
    child,
    setChild,
    openCalendar,
    setOpenCalendar,
    openGuests,
    setOpenGuests,
  } = useReservationStore();

  const containerRef = useRef(null);
  const navigate = useNavigate();

  const startDate = range[0].startDate;
  const endDate = range[0].endDate;

  const start = startDate.toISOString().split("T")[0];
  const end = endDate.toISOString().split("T")[0];

  const nights = differenceInDays(endDate, startDate);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenCalendar(false);
        setOpenGuests(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpenCalendar, setOpenGuests]);

  const isSelected = (day) => day >= startDate && day <= endDate;

  const customDayRenderer = (day) => {
    const selected = isSelected(day);
    const dayNum = day.getDate();
    const dayOfWeek = day.getDay();

    if (selected) {
      return <div style={{ color: "#fff", fontWeight: 700 }}>{dayNum}</div>;
    }

    let color = "#000";
    if (dayOfWeek === 0) color = "#e60000";
    if (dayOfWeek === 6) color = "#005fcc";

    return <div style={{ color, fontWeight: 600 }}>{dayNum}</div>;
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <div
        className="
          bg-white border shadow-lg rounded-2xl
          p-4 md:p-5
          flex flex-col lg:flex-row justify-between
          gap-4 lg:gap-6
          items-stretch lg:items-center
        "
      >
        {/* 날짜 */}
        <div className="relative w-full lg:w-[260px]">
          <div
            className="cursor-pointer"
            onClick={() => {
              setOpenCalendar(!openCalendar);
              setOpenGuests(false);
            }}
          >
            <span className="text-sm text-gray-500">체크인 / 체크아웃</span>
            <div className="font-semibold text-gray-800 text-base md:text-lg mt-1">
              {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {nights}박 {nights + 1}일
            </div>
          </div>

          {openCalendar && (
            <div
              className="
                absolute left-0 top-full mt-3
                w-full md:w-[600px]
                bg-white border shadow-xl rounded-xl z-30
              "
            >
              <DateRange
                locale={ko}
                ranges={range}
                onChange={(item) => setRange(item.selection)}
                editableDateInputs={false}
                moveRangeOnFirstSelection={false}
                months={window.innerWidth < 768 ? 1 : 2}
                minDate={new Date()}
                direction="horizontal"
                rangeColors={["#a67c52"]}
                dayContentRenderer={customDayRenderer}
              />

              <div className="flex justify-center py-3">
                <button
                  className="border border-[#a67c52] text-[#a67c52] px-6 py-2 rounded-lg"
                  onClick={() => setOpenCalendar(false)}
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 인원 */}
        <div className="relative w-full lg:w-[180px]">
          <div
            className="cursor-pointer"
            onClick={() => {
              setOpenGuests(!openGuests);
              setOpenCalendar(false);
            }}
          >
            <span className="text-sm text-gray-500">투숙 인원</span>
            <div className="font-semibold text-gray-800 text-base md:text-lg mt-1">
              성인 {adult}, 어린이 {child}
            </div>
          </div>

          {openGuests && (
            <div className="absolute left-0 top-full mt-3 w-full md:w-[300px] bg-white border shadow-xl rounded-xl p-6 z-30">
              {/* 성인 */}
              <div className="flex justify-between items-center py-3 border-b">
                <p className="font-medium">성인</p>
                <div className="flex gap-4 items-center">
                  <button onClick={() => setAdult(Math.max(1, adult - 1))}>–</button>
                  <span>{adult}</span>
                  <button onClick={() => setAdult(adult + 1)}>+</button>
                </div>
              </div>

              {/* 어린이 */}
              <div className="flex justify-between items-center py-3">
                <p className="font-medium">어린이</p>
                <div className="flex gap-4 items-center">
                  <button onClick={() => setChild(Math.max(0, child - 1))}>–</button>
                  <span>{child}</span>
                  <button onClick={() => setChild(child + 1)}>+</button>
                </div>
              </div>

              <button
                className="w-full mt-4 bg-[#b08a5e] text-white py-3 rounded-lg"
                onClick={() => setOpenGuests(false)}
              >
                선택 완료
              </button>
            </div>
          )}
        </div>

        {/* 검색 버튼 */}
        <button
          className="
            w-full lg:w-auto
            bg-[#3c2c2c] text-white
            px-8 py-4 lg:py-3
            rounded-xl
            hover:bg-[#a67c52]
            transition
          "
          onClick={() =>
            navigate(
              `/reserve/search?start=${start}&end=${end}&adult=${adult}&child=${child}`
            )
          }
        >
          검색
        </button>
      </div>
    </div>
  );
}
