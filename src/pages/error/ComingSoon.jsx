import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 px-4">

      <h1 className="text-2xl font-semibold text-gray-700 mb-2">
        🚧 공사중입니다
      </h1>

      <p className="text-gray-500 mb-8">
        이 페이지는 현재 개발 중이며 곧 이용 가능해집니다.
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
