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

export const router = createBrowserRouter([

  
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <Signup /> },

      // 객실 리스트
      { path: "/rooms", element: <RoomsPage /> },

      // 객실 상세
      { path: "/rooms/:id", element: <RoomDetailPage /> },



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
          {path:"employee", element : <EmployeeListPage />},
          {path:"employee/:id", element : <AddEmployeePage />},
          {path:"employee/:id/edit", element : <AddEmployeePage />},
          {path:"employee/add", element : <AddEmployeePage />},
          
          // 객실관련
          {path:"room", element : <AdminRoomPage />},
        ]
      }

]);
