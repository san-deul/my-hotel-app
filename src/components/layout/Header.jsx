// src/components/layout/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useHeaderStore } from "../../store/headerStore";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase";
import clsx from "clsx";

const MAIN_NAV = [
  { label: "객실", to: "/rooms" },
  { label: "예약", to: "/reserve/search" },
  { label: "호텔소개", to: "/about" },
  { label: "부대시설", to: "/facilities" },
];

export default function Header() {
  const { pathname } = useLocation();

  // Header 상태 (모바일, 스크롤)
  const { open, setOpen, isScrolled, setIsScrolled, isHovered, setIsHovered } = useHeaderStore();

  // 로그인 상태
  const user = useAuthStore((state) => state.user);
  //console.log('user-->', user);
  const logout = useAuthStore((state) => state.logout);

  const isActive = (to) => pathname.startsWith(to);

  // 스크롤 감지
  useEffect(() => {

    if (pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, setIsScrolled]);

  // 화면 리사이즈 → 모바일 메뉴 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  // 로그아웃 처리
  /*
  const handleLogout = async () => {
    await logout(); 
  };
*/


  const headerClass = clsx(
    "fixed top-0 left-0 w-full z-50 transition-colors duration-300",

    // 서브 페이지는 무조건 검정배경 + 흰글자
    pathname !== "/"
      ? "bg-black text-white border-b border-gray-700"
      : // 메인 페이지
      isScrolled
        ? "bg-black text-white border-b border-gray-700"
        : isHovered
          ? "bg-black text-white"
          : "bg-transparent text-white"
  );

  return (
    <>
      <header
        className={headerClass}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-[1280px] mx-auto px-4 h-[70px] flex items-center justify-between">

          {/* LEFT NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={clsx(
                  "transition-colors duration-200 hover:text-[#9c836a]",
                  isActive(item.to) && "text-[#9c836a]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* LOGO */}
          <div className="text-xl font-bold">
            <Link to="/">SD HOTEL</Link>
          </div>

          {/* RIGHT NAV (데스크탑) */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {!user && (
              <>
                <Link to="/login" className="hover:text-[#9c836a]">로그인</Link>
                <span className="text-gray-500">|</span>

                <Link to="/signup" className="hover:text-[#9c836a]">회원가입</Link>
                <span className="text-gray-500">|</span>
              </>
            )}

            {user && (
              <>
                <Link to="/mypage" className="hover:text-[#9c836a]">마이페이지</Link>
                <span className="text-gray-500">|</span>

                <button
                  onClick={logout}
                  className="hover:text-[#9c836a]"
                >
                  로그아웃
                </button>
                <span className="text-gray-500">|</span>
                {(user.role === 'admin' || user.role ==='manager')&&(
                  <Link to="/admin" className="hover:text-[#9c836a]">관리자</Link>
                )}
                {(user.role === 'user')&&(
                  <Link to="/myReservation" className="hover:text-[#9c836a]">예약확인</Link>
                )}

              </>
            )}

            
          </nav>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden flex flex-col gap-1 items-end"
            onClick={() => setOpen(true)}
          >
            <span className="block w-6 h-[2px] bg-white"></span>
            <span className="block w-6 h-[2px] bg-white"></span>
            <span className="block w-6 h-[2px] bg-white"></span>
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* MOBILE MENU */}
      <aside
        className={clsx(
          "fixed top-0 right-0 w-[260px] h-full bg-white z-50 shadow-xl transform transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="text-lg font-semibold">MENU</span>
          <button onClick={() => setOpen(false)}>
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-6">
          {/* MAIN NAV */}
          <div className="flex flex-col gap-4 text-base font-medium">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border-b pb-3"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* RIGHT NAV (모바일) */}
          <div className="mt-6 flex flex-col gap-3 text-sm">

            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  로그인
                </Link>

                <Link
                  to="/signup"
                  className="text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/mypage"
                  className="text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  마이페이지
                </Link>

                <button
                  className="text-left text-gray-700"
                  onClick={logout}
                >
                  로그아웃
                </button>
              
                {(user.role === 'admin' || user.role ==='manager')&&(
                  <Link to="/admin" className="hover:text-[#9c836a]">관리자</Link>
                )}
                {(user.role === 'user')&&(
                  <Link to="/myReservation" className="hover:text-[#9c836a]">예약확인</Link>
                )}



              </>
            )}

            
          </div>
        </div>
      </aside>
    </>
  );
}
