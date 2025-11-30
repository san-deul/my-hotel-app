// src/components/main/MainRooms.jsx
import CarouselSection from "../common/CarouselSection";

export default function MainRooms() {
  const roomMock = [
    {
      id: 1,
      title: "디럭스룸",
      engTitle: "Deluxe Room",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "스위트룸",
      engTitle: "Suite Room",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "패밀리룸",
      engTitle: "Family Room",
      image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      title: "프레지덴셜 스위트",
      engTitle: "Presidential Suite",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="w-full">
      <CarouselSection title="객실 소개" items={roomMock} />
    </div>
  );
}
