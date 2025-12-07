// src/routes/RoleRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleRoute({ allowedRoles }) {
  const user = useAuthStore((state) => state.user);

  // 로그인 안함
  if (!user) return <Navigate to="/login" replace />;

  // 권한 없음
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="p-6 text-red-500">
        해당 페이지에 접근할 권한이 없습니다.
      </div>
    );
  }

  return <Outlet />;
}
