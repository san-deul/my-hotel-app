import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import "./index.css";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalSpinner from "./components/common/GlobalSpinner";


const queryClient = new QueryClient();

export default function App() {

  const { setUser } = useAuthStore();

  useEffect(() => {
    // 앱 시작 시 사용자 세션 로드
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // 로그인/로그아웃/change 이벤트 자동 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    
    
    <QueryClientProvider client={queryClient}>
      <GlobalSpinner />
      <RouterProvider router={router} />
    </QueryClientProvider>
    
    )
}