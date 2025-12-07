// src/pages/LoginPage.jsx
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginPage() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const user = useAuthStore((state) => state.user); 
  const setUser = useAuthStore((state) => state.setUser);


  // 로그인 실패 
  const [loginError, setLoginError] = useState("");

  const onSubmit = async ({ email, password }) => {
  
  setLoginError(""); // 초기화

  let data = null;
  let error = null;

  try {
    ({ data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    }));

    console.log('data-->', data);
    console.log('error-->', error);
  } catch (err) {
    console.error("LOGIN TRY/CATCH ERROR:", err);
    setLoginError("로그인 중 오류가 발생했습니다.");
    return;
  }

  
  if (error) {
    setLoginError("아이디 또는 비밀번호가 잘못되었습니다. 다시 확인해주세요.");
    return;
  }

  // 로그인 성공 → user 저장
  await setUser(data.user);
  const currentUser = useAuthStore.getState().user;

  if(currentUser.role === "admin" || currentUser.role === "manager"){
    window.location.href="/admin"
  }else{
    window.location.href="/"
  }

  alert(`${data.user.email} 님, 환영합니다!`);

  // 메인 페이지 이동


};

  return (
    <>
    {user && <Navigate to="/mypage" replace />}
    <div className="w-full max-w-md mx-auto py-24 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">로그인</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* 이메일 */}
        <div>
          <label className="block mb-1 text-sm font-medium">이메일</label>
          <input
            type="email"
            placeholder="example@hotel.com"
            className="w-full border px-4 py-3 rounded-lg focus:outline-[#9c836a]"
            {...register("email", { required: "이메일을 입력해주세요." })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block mb-1 text-sm font-medium">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full border px-4 py-3 rounded-lg focus:outline-[#9c836a]"
            {...register("password", { required: "비밀번호를 입력해주세요." })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 로그인 실패 메시지 영역 */}
        {loginError && (
          <p className="text-red-600 text-sm mt-2">{loginError}</p>
        )}

        {/* 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#9c836a] text-white py-3 rounded-lg hover:bg-[#8b745e] transition"
        >
          로그인
        </button>
        <button
          type="button"
          onClick = {() => navigate("/signup")}
          className="w-full bg-[#9c836a] text-white py-3 rounded-lg hover:bg-[#8b745e] transition"
        >
          회원가입
        </button>
        <p> 
          ※ 관리자 화면은 <br/>아래 테스트 계정으로 로그인하시면 확인하실 수 있습니다. <br />
          id:admin@test.com // pw: 1234
        </p>
      </form>
    </div>
    </>
  );
}
