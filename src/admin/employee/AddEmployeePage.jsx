import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { apiPost } from "../../lib/apiClient"


// =======================
// Yup Schema
// =======================
const schema = yup.object({
  name: yup.string().required("이름을 입력해주세요."),
  phone: yup.string().required("휴대폰 번호를 입력해주세요."),
  birth: yup
    .string()
    .required("생년월일은 필수 입력 항목입니다.")
    .matches(/^[0-9]{8}$/, "생년월일은 8자리 숫자여야 합니다.")
    .test("valid-date", "올바른 날짜가 아닙니다.", (value) => {
      if (!value) return false;

      const year = Number(value.slice(0, 4));
      const month = Number(value.slice(4, 6));
      const day = Number(value.slice(6, 8));

      const date = new Date(`${year}-${month}-${day}`);

      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      );

    })
    .required("생년월일을 입력해주세요."),
  email: yup.string(),
});

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // super admin / admin 체크
  if (!user || user.role !== "admin") {
    return <div className="p-6 text-red-500">접근 권한이 없습니다.</div>;
  }

  // =======================
  // ⭐ 페이지 진입 시 자동 이메일 생성
  // =======================
  useEffect(() => {
    async function generateEmail() {
      const { data: managers, error } = await supabase
        .from("member")
        .select("email")
        .eq("role", "manager");

      if (error) {
        console.error(error);
        return;
      }

      let maxNumber = 0;

      managers.forEach((m) => {
        const match = m.email?.match(/^manager(\d+)@test\.com$/);
        if (match) {
          const num = parseInt(match[1]);
          if (num > maxNumber) maxNumber = num;
        }
      });

      const newEmail = `manager${maxNumber + 1}@test.com`;

      // ⭐ 이메일 input에 바로 채워 넣기
      setValue("email", newEmail);
    }

    generateEmail();
  }, []);

  // =======================
  // ⭐ 전화번호 자동 하이픈
  // =======================
  const formatPhone = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(
      7,
      11
    )}`;
  };

  // =======================
  // ⭐ 직원 추가 submit
  // =======================
  const onSubmit = async (form) => {
    try {
      setLoading(true);

      await apiPost("/api/addEmployee", {
        name: form.name,
        phone: form.phone,
        birth: form.birth,
        email: form.email,

      });


      alert(`직원 추가 완료!\n아이디: ${form.email}`);
      navigate("/admin/employee");

    } catch (err) {
      console.error(err);
      alert("직원 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-8 text-[#696cff]">직원 추가</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded shadow p-8 w-full max-w-3xl"
      >
        {/* 자동 생성 이메일 */}
        <div className="mb-4">
          <label className="font-semibold block mb-1">이메일 (자동 생성)</label>
          <input
            {...register("email")}
            readOnly
            disabled
            className="border rounded w-full p-2 bg-gray-100 text-gray-600"
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
            <p className="text-red-500 text-sm mt-1">
              {errors.phone.message}
            </p>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.birth.message}
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="bg-[#696cff] text-white px-5 py-2 rounded"
          >
            {loading ? "처리중..." : "추가하기"}
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

function Input({
  label,
  name,
  register,
  errors,
  type = "text",
  placeholder = "",
}) {
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
