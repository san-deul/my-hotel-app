import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export default function AdminNavi() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm left-0  top-[70px] h-[calc(100vh-70px)] py-6 px-4">
      <h2 className="text-xl font-semibold mb-8">관리자 메뉴</h2>

      {/* Dashboard */}
      <nav className="space-y-4">

        <Link
          to="/admin"
          className="block py-2 px-2 rounded hover:bg-gray-100"
        >
          🏠 홈 (Dashboard)
        </Link>

        {/* 직원 관리 */}
        <div>
          <button
            onClick={() => toggleMenu("staff")}
            className="w-full flex justify-between items-center py-2 px-2 hover:bg-gray-100 rounded"
          >
            👤 직원 관리
            <FiChevronDown
              className={`transition-transform ${openMenu === "staff" ? "rotate-180" : ""
                }`}
            />
          </button>

          {openMenu === "staff" && (
            <div className="ml-4 mt-2 space-y-2">
              <Link to="/admin/employee/add" className="block hover:text-blue-600">
                직원 추가
              </Link>
              <Link to="/admin/employee" className="block hover:text-blue-600">
                직원 목록
              </Link>
            </div>
          )}
        </div>

        {/* 객실 관리 */}
        <div>
          <Link
            to="/admin/room"
            className="w-full flex justify-between items-center py-2 px-2 hover:bg-gray-100 rounded"
          >
            🏨 객실 관리
          </Link>
        </div>

        {/* 예약 관리 */}
        
        <div>
          <button
            onClick={() => toggleMenu("reserve")}
            className="w-full flex justify-between items-center py-2 px-2 hover:bg-gray-100 rounded"
          >
            📅 예약 관리 (준비중입니다.)
            <FiChevronDown
              className={`transition-transform ${openMenu === "reserve" ? "rotate-180" : ""
                }`}
            />
          </button>
                {/*
          {openMenu === "reserve" && (
            <div className="ml-4 mt-2 space-y-2">
              <Link to="/admin/reserve/today" className="block hover:text-blue-600">
                오늘의 체크인
              </Link>
              <Link to="/admin/reserve/all" className="block hover:text-blue-600">
                예약 전체 보기
              </Link>
              <Link to="/admin/reserve/list" className="block hover:text-blue-600">
                예약 목록
              </Link>
            </div>
          )}
          */}
        </div>

        {/* 설정 */}
        <div>
          <button
            onClick={() => toggleMenu("setting")}
            className="w-full flex justify-between items-center py-2 px-2 hover:bg-gray-100 rounded"
          >
            ⚙️ 설정
            <FiChevronDown
              className={`transition-transform ${openMenu === "setting" ? "rotate-180" : ""
                }`}
            />
          </button>
                {/*
          {openMenu === "setting" && (
            <div className="ml-4 mt-2 space-y-2">
              <Link to="/admin/profile" className="block hover:text-blue-600">
                프로필 관리
              </Link>
              <Link to="/admin/settings" className="block hover:text-blue-600">
                사이트 설정
              </Link>
            </div>
          )}
            */}
        </div>
      </nav>
    </aside>
  );
}
