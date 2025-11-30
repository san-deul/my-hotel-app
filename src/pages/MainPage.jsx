import MainFacilities from "../components/main/MainFacilities";
import MainRooms from "../components/main/MainRooms";
import MainVisual from "../components/main/MainVisual";
import ReservationBar from "../components/reservation/ReservationBar";

export default function MainPage({ }) {

  return (
    <div className="w-full">
      <MainVisual />
      <div className="w-full">
        <div className="max-w-5xl mx-auto px-4 my-34">
          <ReservationBar />
        </div>
      </div>
      <MainRooms />
      <MainFacilities />  

    </div>
  );

}
