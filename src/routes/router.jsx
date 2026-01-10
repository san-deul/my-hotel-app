import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import Signup from "../pages/Signup";
import NotFound from "../pages/error/NotFound";
import RoomsPage from "../pages/RoomsPage";
import RoomDetailPage from "../pages/RoomDetailPage";
import AdminLayout from "../admin/AdminLayout";
import AddEmployeePage from "../admin/employee/AddEmployeePage";
import AdminRoomPage from "../admin/rooms/AdminRoomPage";
import EmployeeListPage from "../admin/employee/EmployeeListPage";
import RoomSearchPage from "../pages/reserve/RoomSearchPage";
import MyPage from "../pages/user/MyPage";
import ChangePassword from "../pages/user/ChangePassword";
import ReservePage from "../pages/reserve/ReservePage";
import PaymentPage from "../pages/reserve/PaymentPage";
import ReservationListPage from "../admin/reservations/ReservationListPage";
import ReservationDetailPage from "../admin/reservations/ReservationDetailPage";
import ReservationCalendarPage from "../admin/reservations/ReservationCalendarPage";
import AdminDashboard from "../admin/AdminDashboard";
import AdminReservationListPage from "../admin/AdminReservationListPage";
import MyReservationPage from "../pages/user/MyReservationPage";
import MyReservationDetailPage from "../pages/user/MyReservationDetailPage";
import EditEmployeePage from "../admin/employee/EditEmployeePage";
import SalesPage from "../admin/sales/SalesPage";
import MyInfo from "../pages/user/MyInfo";
import MyFavoriteList from "../pages/user/myFavoriteList";
import AdminFacilityPage from "../admin/facility/AdminFacilityPage";
import InfoPage from "../pages/InfoPage";
import FacilityPage from "../pages/FacilityPage";

export const router = createBrowserRouter([

  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <Signup /> },
      { path: "/about", element: <InfoPage /> },
      { path: "/facilities", element: <FacilityPage /> },

      // 유저관련
      { path: "/mypage", element: <MyPage /> },
      { path: "/myinfo", element: <MyInfo /> },

      { path: "/change-password", element: <ChangePassword /> },
      { path: "/myReservation", element: <MyReservationPage /> },
      { path: "/reservations/:id", element: <MyReservationDetailPage /> },
      { path: "/myFavorites", element: <MyFavoriteList /> },

      // 객실 리스트
      { path: "/rooms", element: <RoomsPage /> },

      // 객실 상세
      { path: "/rooms/:id", element: <RoomDetailPage /> },

      // 예약
      { path: "/reserve/search", element: <RoomSearchPage /> },
      { path: "/reserve", element: <ReservePage /> },
      { path: "/payment", element: <PaymentPage /> },

      { path: "*", element: <NotFound /> },
    ],
  },
      //------
      // 관리자화면
      //----
      {
        path:"/admin",
        element: < AdminLayout />,
        children :[
          { index: true, element: <AdminDashboard /> },
          
          // 직원관련
          {path:"employee", element : <EmployeeListPage />},
          {path:"employee/:id", element : <AddEmployeePage />},
          {path:"employees/edit/:id", element : <EditEmployeePage />},
          {path:"employee/add", element : <AddEmployeePage />},
          
          // 객실관련
          {path:"room", element : <AdminRoomPage />},
          
          // 부대시설
          {path:"facility", element : <AdminFacilityPage />},
          
          // 예약관련
          {path:"reserve", element : <ReservationListPage />},
          {path:"reservations/:id", element : <ReservationDetailPage />},
          {path:"reserve/condition", element : <ReservationCalendarPage />},
          {path:"reservations", element : <AdminReservationListPage />},

          //매출관련
          {path:"sales", element : <SalesPage />},
        ]
      }

]);
