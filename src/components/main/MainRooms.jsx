// src/components/main/MainRooms.jsx
import { useQuery } from "@tanstack/react-query";
import CarouselSection from "../common/CarouselSection";
import { supabase } from "../../lib/supabase";

export default function MainRooms() {

  const getRoomImage = (path) => {
    if (!path) return;

    const { data } = supabase.storage
      .from("room_images")
      .getPublicUrl(path);

    return data.publicUrl;
  };


  const { data: rooms = [], } = useQuery({
    queryKey: ["room-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room")
        .select(`
        *,
        room_img(*)
        `,
        )
        .neq("depth","0")
        .order("room_no")
      //console.log('data-->', data);
      if (error) throw error;

      return data.map((room) => {
        const mainImg = room.room_img?.find(img => img.is_main);
        const imagePath = mainImg?.upload_path;
        return {
          id: room.room_no,
          title: room.room_name,
          image: imagePath
      ? getRoomImage(imagePath)
      : "/images/no-image.jpg",
        }
      })

    }
  })



  console.log('rooms--->', rooms);

  return (
    <div className="w-full">
      <CarouselSection title="객실 소개" items={rooms} />
    </div>
  );
}
