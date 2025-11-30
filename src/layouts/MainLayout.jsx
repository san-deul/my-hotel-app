import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  const { pathname } = useLocation();

  // 메인 페이지인지 체크
  const isMain = pathname === "/";

  return (
    <>
      <Header />

      {/* 메인 페이지는 pt 제거, 서브는 70px 적용 */}
      <main className={isMain ? "" : "pt-[70px]"}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
