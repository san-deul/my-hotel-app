import { useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { addDays, differenceInDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ko } from "date-fns/locale";
import { useReservationStore } from "../../store/useReservationStore";



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

  const containerRef = useRef();

  // 바깥 클릭 → 드롭다운 닫기
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {  // containerRef.current가 null이 아니면, && 바깥클릭하면 
        setOpenCalendar(false);
        setOpenGuests(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpenCalendar, setOpenGuests]);

  const nights = differenceInDays(range[0].endDate, range[0].startDate);

  const isSelected = (day) => {
    const start = range[0].startDate;
    const end = range[0].endDate;
    return day >= start && day <= end;
  };

  const customDayRenderer = (day) => {
    const selected = isSelected(day);
    const dayNum = day.getDate();
    const dayOfWeek = day.getDay();

    if (selected) {
      return (
        <div style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>
          {dayNum}
        </div>
      );
    }

    let color = "#000";
    if (dayOfWeek === 0) color = "#e60000"; // 일요일
    if (dayOfWeek === 6) color = "#005fcc"; // 토요일

    return (
      <div style={{ color, fontWeight: "600", textAlign: "center" }}>
        {dayNum}
      </div>
    );
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <div className="bg-white shadow-lg border rounded-2xl px-6 py-5 flex items-center justify-between gap-6">

        {/* ============================ */}
        {/* 체크인 / 체크아웃 */}
        {/* ============================ */}
        <div className="relative w-[260px]">
          <div
            className="cursor-pointer"
            onClick={() => {
              setOpenCalendar(!openCalendar);
              setOpenGuests(false);
            }}
          >
            <span className="text-sm text-gray-500">체크인 / 체크아웃</span>

            <div className="font-semibold text-gray-800 text-lg mt-1">
              {range[0].startDate.toLocaleDateString()} –{" "}
              {range[0].endDate.toLocaleDateString()}
            </div>

            <div className="text-sm text-gray-500 mt-1">
              {nights}박 {nights + 1}일
            </div>
          </div>

          {openCalendar && (
            <div className="absolute left-0 top-full mt-3 w-[600px] bg-white shadow-xl border rounded-xl z-20 p-0">
              <DateRange
                locale={ko}
                editableDateInputs={false}
                onChange={(item) => setRange(item.selection)}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={2}
                direction="horizontal"
                rangeColors={["#a67c52"]}
                dayContentRenderer={customDayRenderer}
              />

              <div className="flex justify-center mt-3">
                <button
                  className="border border-[#a67c52] text-[#a67c52] px-6 py-2 rounded-lg hover:bg-[#f9f5ef]"
                  onClick={() => setOpenCalendar(false)}
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================ */}
        {/* 인원 선택 */}
        {/* ============================ */}
        <div className="relative w-[150px]">
          <div
            className="cursor-pointer"
            onClick={() => {
              setOpenGuests(!openGuests);
              setOpenCalendar(false);
            }}
          >
            <span className="text-sm text-gray-500">투숙 인원</span>
            <div className="font-semibold text-gray-800 text-lg mt-1">
              성인 {adult}, 어린이 {child}
            </div>
          </div>

          {openGuests && (
            <div className="absolute left-0 top-[105%] w-[300px] bg-white shadow-xl border rounded-xl p-6 z-20">

              {/* 성인 */}
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">성인</p>
                  <p className="text-sm text-gray-400">(만 13세 이상)</p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAdult(Math.max(1, adult - 1))}
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-lg"
                  >
                    –
                  </button>

                  <span className="w-6 text-center font-semibold">{adult}</span>

                  <button
                    onClick={() => setAdult(adult + 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 어린이 */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">어린이</p>
                  <p className="text-sm text-gray-400">(37개월~만 12세)</p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setChild(Math.max(0, child - 1))}
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-lg"
                  >
                    –
                  </button>

                  <span className="w-6 text-center font-semibold">{child}</span>

                  <button
                    onClick={() => setChild(child + 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="w-full mt-4 bg-[#b08a5e] text-white py-3 rounded-lg hover:bg-[#a28057]"
                onClick={() => setOpenGuests(false)}
              >
                선택 완료
              </button>
            </div>
          )}
        </div>

        {/* 검색 */}
        <button className="bg-[#3c2c2c] text-white px-8 py-3 rounded-xl hover:bg-[#2b2222] transition">
          검색
        </button>
      </div>
    </div>
  );
}
