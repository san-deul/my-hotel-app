import { useQuery } from "@tanstack/react-query";
import { fetchRooms, getRoomImageUrl, } from "../api/roomApi";


export const useRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    select: (rooms) =>
      rooms.filter((room)=>room.depth !== 0)        
      .map((room) => {
        const mainImg = room.room_img?.find(img => img.is_main);
        const imagePath = mainImg?.upload_path;

        console.log('room?', room)
        console.log('mainImg-->', mainImg)
        console.log('imagePath-->', imagePath)

        console.log(
         '지금이거-->', getRoomImageUrl(imagePath)
        );

        return {
          id: room.room_no,
          title: room.room_name,
          image: imagePath
            ? getRoomImageUrl(imagePath)
            : "/images/no-image.jpg",
        };
      }),
  });
};