import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export default function AdminNavi({ collapsed }) { //collapsed->true : 아이콘모드
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <aside className="h-full bg-white shadow-sm py-6 px-2">
      {/* 타이틀 */}
      {!collapsed && (
        <h2 className="text-xl font-semibold mb-8 px-2">
          관리자 메뉴
        </h2>
      )}

      <nav className="space-y-2">
        {/* Dashboard */}
        <Link
          to="/admin"
          className={`flex items-center rounded hover:bg-gray-100 px-2 py-2
            ${collapsed ? "justify-center" : "gap-3"}
          `}
          title="대시보드"
        >
          <span className="text-lg">🏠</span>
          {!collapsed && <span>홈 (Dashboard)</span>}
        </Link>

        {/* 직원 관리 */}
        <div>
          <button
            onClick={() => toggleMenu("staff")}
            className={`w-full flex items-center rounded hover:bg-gray-100 px-2 py-2
              ${collapsed ? "justify-center" : "gap-3"}
            `}
            title="직원 관리"
          >
            <span className="text-lg">👤</span>

            {!collapsed && (
              <>
                <span className="flex-1 text-left">직원 관리</span>
                <FiChevronDown
                  className={`transition-transform ${openMenu === "staff" ? "rotate-180" : ""
                    }`}
                />
              </>
            )}
          </button>

          {!collapsed && openMenu === "staff" && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                to="/admin/employee/add"
                className="block text-sm hover:text-blue-600"
              >
                직원 추가
              </Link>
              <Link
                to="/admin/employee"
                className="block text-sm hover:text-blue-600"
              >
                직원 목록
              </Link>
            </div>
          )}
        </div>

        {/* 객실 관리 */}
        <Link
          to="/admin/room"
          className={`flex items-center rounded hover:bg-gray-100 px-2 py-2
            ${collapsed ? "justify-center" : "gap-3"}
          `}
          title="객실 관리"
        >
          <span className="text-lg">🏨</span>
          {!collapsed && <span>객실 관리</span>}
        </Link>

        {/* 부대시설 */}
        <Link
          to="/admin/facility"
          className={`flex items-center rounded hover:bg-gray-100 px-2 py-2
            ${collapsed ? "justify-center" : "gap-3"}
          `}
          title="부대시설"
        >
          <span className="text-lg">🏪</span>
          {!collapsed && <span>부대시설</span>}
        </Link>

        {/* 예약 관리 */}
        <div>
          <button
            onClick={() => toggleMenu("reserve")}
            className={`w-full flex items-center rounded hover:bg-gray-100 px-2 py-2
              ${collapsed ? "justify-center" : "gap-3"}
            `}
            title="예약 관리"
          >
            <span className="text-lg">📅</span>

            {!collapsed && (
              <>
                <span className="flex-1 text-left">예약 관리</span>
                <FiChevronDown
                  className={`transition-transform ${openMenu === "reserve" ? "rotate-180" : ""
                    }`}
                />
              </>
            )}
          </button>

          {!collapsed && openMenu === "reserve" && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                to="/admin/reserve"
                className="block text-sm hover:text-blue-600"
              >
                예약 페이지
              </Link>
              <Link
                to="/admin/reserve/condition"
                className="block text-sm hover:text-blue-600"
              >
                예약 현황
              </Link>
            </div>
          )}
        </div>

        {/* 매출 관리 */}
        <Link
          to="/admin/sales"
          className={`flex items-center rounded hover:bg-gray-100 px-2 py-2
            ${collapsed ? "justify-center" : "gap-3"}
          `}
          title="매출 관리"
        >
          <span className="text-lg">📊</span>
          {!collapsed && <span>매출 관리</span>}
        </Link>


        <Link
          to="/"
          className={`flex items-center rounded hover:bg-gray-100 px-2 py-2
            ${collapsed ? "justify-center" : "gap-3"}
          `}
          title="메인페이지"
        >
          <span className="text-lg">🏠</span>
          {!collapsed && <span>메인페이지</span>}
        </Link>

      </nav>
    </aside>
  );
}
