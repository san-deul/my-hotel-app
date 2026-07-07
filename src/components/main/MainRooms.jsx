// src/components/main/MainRooms.jsx
import CarouselSection from "../common/CarouselSection";
import { useRooms } from "../../hooks/useRooms";


export default function MainRooms() {

  const { data: rooms = [] } = useRooms();

  console.log('data-->', rooms);
  



  return (
    <div className="w-full">
      <CarouselSection title="객실 소개" items={rooms} />
    </div>
  );
}
