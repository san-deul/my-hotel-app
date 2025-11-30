import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const MAIN_NAV = [
  { label: "객실", to: "/rooms" },
  { label: "예약", to: "/reserve" },
  { label: "호텔", to: "/hotel" },
  { label: "소개", to: "/about" },
];

const RIGHT_NAV = [
  { label: "로그인", to: "/login" },
  { label: "회원가입", to: "/signup" },
  { label: "문의", to: "/contact" },
];

export default function Header() {
  const { pathname } = useLocation();

  const isActive = (to) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  return (
    <header className="w-full fixed top-0 left-0 bg-transparent group transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 text-sm 
                      text-black group-hover:text-white transition-colors duration-300">

        {/* LEFT MENU */}
        <nav className="flex items-center gap-4 sm:gap-6">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={clsx(
                "transition-colors duration-300",
                isActive(item.to)
                  ? "rounded-full bg-black text-white px-4 py-1 font-medium group-hover:bg-white group-hover:text-black"
                  : "hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT MENU */}
        <nav className="flex items-center gap-3 sm:gap-4">
          {RIGHT_NAV.map((item, index) => (
            <div key={item.to} className="flex items-center gap-3">
              <Link
                to={item.to}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
              {index !== RIGHT_NAV.length - 1 && (
                <span className="hidden sm:inline text-gray-300 group-hover:text-gray-500">|</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Background fade overlay */}
      <div className="absolute inset-0 group-hover:bg-black transition-colors duration-300 -z-10"></div>
    </header>
  );
}



header{height:60px } 배경 투명, 글자 검정..
header 에 hovert 시 배경 검정. 글자 흰색
각각 의 메뉴의 hover 시 color: #9c836a