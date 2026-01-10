import { useQuery } from "@tanstack/react-query";
import { fetchFavoriteList } from "../../api/favorites";
import { Link } from "react-router-dom";

export default function MyFavoriteList() {
  const { data, isLoading } = useQuery({
    queryKey: ["favoriteList"],
    queryFn: fetchFavoriteList,
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data || data.length === 0)
    return <div>찜한 객실이 없습니다.</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">찜 목록</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((fav) => (
          <li
            key={fav.room_no}
            className="border  p-4 hover:shadow grid-cols-2"
          >
            <Link to={`/rooms/${fav.room?.room_no}`}
              className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                <p>{fav.room.room_name}</p>
                
                <p>가격: {fav.room.price?.toLocaleString()}원</p>
              </div>

              <div className="mt-2">
                <img
                  src={fav.room?.room_img?.[0]?.publicUrl || "/no-image.png"}
                  alt={fav.room.room_name}
                  className="w-full h-40 object-cover rounded"
                />
              </div>


            </Link>

          </li>
        ))}
      </ul>
    </div>
  );
}
