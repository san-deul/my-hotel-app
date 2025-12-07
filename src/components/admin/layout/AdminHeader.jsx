// src/components/admin/layout/AdminHeader.jsx
import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import clsx from "clsx";

export default function AdminHeader() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);
/*  #696cff */
  return (
    <header className="border-b bg-white">
      <div className="max-w-[1280px] mx-auto px-4 h-[70px] flex items-center justify-between">
        
        {/* ========== 왼쪽: 로고 또는 어드민 문구 ========== */}
        <div className="flex items-center gap-3">
          <div className="text-xl font-semibold text-gray-800">관리자페이지</div>
        </div>

        {/* ========== 오른쪽: 유저 정보 + 드롭다운 ========== */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-3 py-1 border rounded-full hover:bg-gray-50 transition"
          >
            <span className="text-sm text-gray-700">
              {user?.email || "Unknown User"}
            </span>
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* ▼ 드롭다운 */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => alert("Edit Profile 페이지로 이동")}
              >
                Edit Profile
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
