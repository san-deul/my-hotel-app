// src/components/main/MainFacilities.jsx
import CarouselSection from "../common/CarouselSection";

export default function MainFacilities() {
  const facilityMock = [
    {
      id: 1,
      title: "루프탑",
      engTitle: "Rooftop",
      image:
        "https://images.unsplash.com/photo-1621275471769-e6aa344546d5?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "개인 단체 행사",
      engTitle: "Meetings & Events",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "피트니스 센터",
      engTitle: "Fitness Center",
      image:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "산책로",
      engTitle: "Fitness Center",
      image:
        "https://images.unsplash.com/photo-1622623610300-c9efbc465698?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      title: "온수풀",
      engTitle: "Fitness Center",
      image:
        "https://images.unsplash.com/photo-1729605412044-81f6acce4370?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="w-full">
      <CarouselSection title="부대시설 안내" items={facilityMock} />
    </div>
  );
}
