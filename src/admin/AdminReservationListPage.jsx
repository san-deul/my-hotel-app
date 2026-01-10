import { useSearchParams } from "react-router-dom";
import TodayCheckinPage from "./reservations/TodayReservationPage";
import TodayReservationPage from "./reservations/TodayReservationPage";

export default function AdminReservationListPage() {
  const [params] = useSearchParams();
  const type = params.get("type"); // checkin | checkout

  return (
    <>
      {type === "checkin" && <TodayReservationPage mode="checkin" />}
      {type === "checkout" && <TodayReservationPage mode="checkout" />}
    </>
  );
}
