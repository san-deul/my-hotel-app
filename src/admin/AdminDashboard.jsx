import { useAuthStore } from "../store/authStore";


export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        안녕하세요, {user?.email || "관리자"}님!
      </h1>

      <p className="text-gray-600 mt-3">
        관리자 페이지에 오신 것을 환영합니다.
      </p>
    </div>
  );
}
