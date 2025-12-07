import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 px-4">
      <h1 className="text-8xl font-bold text-[#a67c52] mb-6">404</h1>

      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        페이지를 찾을 수 없습니다
      </h2>

      <p className="text-gray-500 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었어요.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-[#a67c52] text-white font-semibold hover:bg-[#8d6d46] transition-all"
      >
        메인으로 돌아가기
      </Link>
    </div>
  );
}
