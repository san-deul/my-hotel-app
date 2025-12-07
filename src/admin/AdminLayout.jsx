
import { Navigate, Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/layout/AdminHeader";
import { useAuthStore } from "../store/authStore";
import AdminNavi from "../components/admin/layout/AdminNavi";


export default function AdminLayout() {
  const isLoading = useAuthStore(state => state.isLoading);
  const user = useAuthStore(state => state.user)

  console.log('admin 페이지 ::', user)

  if (isLoading) return null; 
  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin") {
    try{
      console.log('gsgdsgs')
    }catch(err){
      console.log(err)
    }
    return <Navigate to="/" />};

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminNavi />

        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
