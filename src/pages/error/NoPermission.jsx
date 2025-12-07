import { Link } from "react-router-dom";

export default function NoPermission() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 px-4">
      <h1 className="text-8xl font-bold text-[#a67c52] mb-6">⛔ 접근 불가</h1>

      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        이 페이지에 접근할 권한이 없습니다.
      </h2>


      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-[#a67c52] text-white font-semibold hover:bg-[#8d6d46] transition-all"
      >
        메인으로 돌아가기
      </Link>
    </div>
  );
}
