import { RouterProvider  } from "react-router-dom";
import { router } from "./routes/router";
import "./index.css";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalSpinner from "./components/common/GlobalSpinner";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChatProvider from "./provider/ChatProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const queryClient = new QueryClient();

export default function App() {

  const { setUser } = useAuthStore();

  useEffect(() => {
    // 앱 시작 시 사용자 세션 로드
    /*
    supabase.auth.getSession().then(({ data: { session } }) => {
      if(session?.user){
        setUser(session.user)
      }
      
    });
    */

    // 로그인/로그아웃/change 이벤트 자동 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
    // celanup 코드 ; 현재 effect정리
  }, []);

  return (
    
    
    <QueryClientProvider client={queryClient}>
      <GlobalSpinner />
      <ChatProvider>
        <RouterProvider router={router} />
      </ChatProvider>
    </QueryClientProvider>
    
    )
}