// src/admin/employee/EditEmployeePage.jsx

import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";

// =======================
// Yup Schema
// =======================
const schema = yup.object({
  name: yup.string().required("이름을 입력해주세요."),
  phone: yup.string().required("휴대폰 번호를 입력해주세요."),
  birth: yup
    .string()
    .matches(/^[0-9]{8}$/, "생년월일은 8자리 숫자여야 합니다.")
    .required("생년월일을 입력해주세요."),
});

export default function EditEmployeePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // 직원 id
  const authUser = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // =======================
  // 권한 체크
  // =======================
  if (!authUser || authUser.role !== "admin") {
    return <div className="p-6 text-red-500">접근 권한이 없습니다.</div>;
  }

  // =======================
  // ⭐ 전화번호 자동 하이픈
  // =======================
  const formatPhone = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  // =======================
  // ⭐ 직원 정보 불러오기
  // =======================
  useEffect(() => {
    const fetchEmployee = async () => {
      const { data, error } = await supabase
        .from("member")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        alert("직원 정보를 불러오지 못했습니다.");
        navigate(-1);
        return;
      }

      // 데이터 폼 세팅
      setValue("email", data.email);
      setValue("name", data.name);
      setValue("phone", data.phone);
      setValue("birth", data.birth);

      setLoading(false);
    };

    fetchEmployee();
  }, [id, navigate, setValue]);

  // =======================
  // ⭐ 수정 submit
  // =======================
  const onSubmit = async (form) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("member")
        .update({
          name: form.name,
          phone: form.phone,
          birth: form.birth,
        })
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("수정 실패!");
        return;
      }

      alert("직원 정보가 수정되었습니다!");
      navigate("/admin/employees");
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">불러오는 중...</div>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-8 text-[#696cff]">직원 정보 수정</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded shadow p-8 w-full max-w-3xl"
      >
        {/* 이메일 - 수정 불가 */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">이메일</label>
          <input
            {...register("email")}
            disabled
            className="border rounded w-full p-2 bg-gray-100"
          />
        </div>

        {/* 이름 */}
        <Input
          label="이름"
          name="name"
          placeholder="직원 이름"
          register={register}
          errors={errors}
        />

        {/* 연락처 */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">연락처</label>
          <input
            {...register("phone")}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setValue("phone", formatted);
            }}
            className="border rounded w-full p-2"
            placeholder="010-1234-5678"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* 생년월일 */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">생년월일 (8자리)</label>
          <input
            type="text"
            maxLength={8}
            {...register("birth")}
            placeholder="19991231"
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              setValue("birth", onlyNums);
            }}
            className="border rounded w-full p-2"
          />
          {errors.birth && (
            <p className="text-red-500 text-sm mt-1">{errors.birth.message}</p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="bg-[#696cff] text-white px-5 py-2 rounded"
          >
            {loading ? "처리중..." : "수정하기"}
          </button>

          <button
            type="button"
            className="px-5 py-2 rounded border"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

// =======================
// 공통 Input 컴포넌트
// =======================
function Input({ label, name, register, errors, type = "text", placeholder = "" }) {
  return (
    <div className="mb-4">
      <label className="font-semibold block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="border rounded w-full p-2"
      />

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
