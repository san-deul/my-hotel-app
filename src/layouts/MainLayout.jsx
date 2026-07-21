import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuthStore } from "../store/authStore";
import ChatBtn from "../components/admin/chat/ChatBtn";
import { useState } from "react";
import ChatContainer from "../components/layout/ChatContainer";

export default function MainLayout() {
  const { pathname } = useLocation();

  // 메인 페이지인지 체크
  const isMain = pathname === "/";
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 메인 페이지는 pt 제거, 서브는 70px 적용 */}
      <main className={`${isMain ? "" : "pt-[70px]"} flex-1`}>
        <Outlet />
        {(user?.role === "admin" || user?.role === "manager") && (
          <ChatContainer />
        )}
      </main>

      <Footer />
    </div>
  );
}
