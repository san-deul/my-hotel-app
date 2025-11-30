import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";
import RoomsPage from "../pages/RoomsPage";
import RoomDetailPage from "../pages/RoomDetailPage";

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
]);
