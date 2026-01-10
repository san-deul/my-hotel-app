import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  password: yup
    .string()
    .min(6, "비밀번호는 최소 6자리 이상이어야 합니다.")
    .required("비밀번호를 입력해주세요."),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인을 입력해주세요."),
});

export default function ChangePassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("비밀번호가 성공적으로 변경되었습니다!");
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("비밀번호 변경 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-lg mx-auto mt-10 min-h-screen"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 변경</h2>

      <div className="mb-4">
        <label className="block mb-1">새 비밀번호</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1">비밀번호 확인</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          {...register("password_confirm")}
        />
        {errors.password_confirm && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password_confirm.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded mt-4"
      >
        {loading ? "처리중..." : "비밀번호 변경"}
      </button>
    </form>
  );
}
