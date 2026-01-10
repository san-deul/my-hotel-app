// src/components/facilities/FaciNav.jsx

import { Link, useLocation } from "react-router-dom";
import { useFacilitiesQuery } from "../../hooks/useFacilitiesQuery.js";

export default function FaciNav() {
  const { pathname } = useLocation();
  const { data: facilities, isLoading } = useFacilitiesQuery();

  if (isLoading) {
    return <aside className="w-64 p-6">로딩중...</aside>;
  }

  if (!facilities || facilities.length === 0) {
    return <aside className="w-64 p-6">데이터 없음</aside>;
  }

  return (
    <aside className="
        bg-[#f4ecd4] border-b md:border-r
        top-0 left-0 z-40
        w-full md:w-64
        px-4 md:px-6
        py-3 md:py-10
       ">
      <h2 className="text-xl font-serif mb-6">부대시설</h2>

      <ul className="space-y-2">
        {facilities.map((faci) => {
          const isActive = pathname.includes(String(faci.id));

          return (
            <li key={faci.id}>
              <Link
                to={`/facilities/${faci.id}`}
                className={`block px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-[#ede4cb] text-[#6d563b] font-medium"
                    : "text-gray-700 hover:bg-[#ede4cb]"
                }`}
              >
                {faci.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
