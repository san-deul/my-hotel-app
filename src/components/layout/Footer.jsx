// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d0d0d] text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* 상단 영역 */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10">

          {/* LEFT - 로고 + 텍스트 */}
          <div className="flex flex-col gap-6">
            {/* 로고 */}
            <div className="text-xl font-bold">
              <Link to="/">SD HOTEL</Link>
            </div>

            {/* 정보 */}
            <ul className="text-sm leading-6 text-gray-400">
              <li>Address. 서울특별시 xxxxx xxxx 100</li>
              <li>
                Tel. +82-(0)02-000-0000 WhatsApp +82-(0)10-0000-0000 (Message Only)
                Fax +82-(0)02-000 - 0000
              </li>
              <li>E-mail info@sd hotel.com</li>
            </ul>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-sm text-gray-500 flex flex-col md:flex-row md:justify-between gap-3">
          <p>Copyright©2025 SD Hotel&Suits. All rights reserved.</p>

        </div>

      </div>
    </footer>
  );
}
