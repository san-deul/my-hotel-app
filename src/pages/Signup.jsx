import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDaumPostcodePopup } from "react-daum-postcode";
import * as yup from "yup";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// =======================
// Yup Schema
// =======================
const schema = yup.object({
  email: yup
    .string()
    .email("올바른 이메일 형식이 아닙니다.")
    .required("이메일은 필수 입력 항목입니다."),

  password: yup
    .string()
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
    .required("비밀번호를 입력해주세요."),

  password_confirm: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인을 입력해주세요."),

  name: yup.string().required("이름을 입력해주세요."),

  phone: yup.string().required("휴대폰 번호를 입력해주세요."),

  birth: yup
    .string()
    .matches(/^[0-9]{8}$/, "생년월일은 8자리 숫자여야 합니다.")
    .test("valid-date", "올바른 날짜가 아닙니다.", (value) => {
      if (!value) return false;
      const year = Number(value.slice(0, 4));
      const month = Number(value.slice(4, 6));
      const day = Number(value.slice(6, 8));
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      );
    })
    .required("생년월일을 입력해주세요."),

  zipcode: yup.string().required("우편번호를 입력해주세요."),

  basic_address: yup
    .string()
    .required("기본 주소를 입력해주세요."),

  detail_address: yup.string(),
});

export default function Signup() {
  const navigate = useNavigate();
  const openDaumPopup = useDaumPostcodePopup();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // =======================
  // 전화번호 자동 하이픈
  // =======================
  const formatPhone = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, "");

    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;

    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(
      3,
      7
    )}-${onlyNums.slice(7, 11)}`;
  };

  // =======================
  // 주소 검색 완료
  // =======================
  const handlePostcodeComplete = (data) => {
    let full = data.address;
    let extra = "";

    if (data.bname !== "") extra = data.bname;
    if (data.buildingName !== "")
      extra += extra ? `, ${data.buildingName}` : data.buildingName;

    if (extra) full += ` (${extra})`;

    setValue("zipcode", data.zonecode);
    setValue("basic_address", full);
    setValue("detail_address", "");
  };

  // =======================
  // 주소팝업
  // =======================
  const handleOpenPostcode = () => {
    openDaumPopup({ onComplete: handlePostcodeComplete });
  };

  // =======================
  // 회원가입 제출
  // =======================
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // 1) Auth 생성
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        alert(authError.message);
        return;
      }

      const user = authData.user;

      // 2) member 테이블 insert
      await supabase.from("member").insert([
        {
          id: user.id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          zipcode: data.zipcode,
          basic_address: data.basic_address,
          detail_address: data.detail_address,
          birth: data.birth,
          role: "user",
        },
      ]);

       alert(`${data.name} 님, 가입을 환영합니다!`);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-lg mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>

      {/* 이름 */}
      <Input label="이름" name="name" register={register} errors={errors} />

      {/* 이메일 */}
      <Input label="이메일" name="email" register={register} errors={errors} placeholder="example@example.com"/>

      {/* 비밀번호 */}
      <Input
        type="password"
        label="비밀번호"
        name="password"
        register={register}
        errors={errors}
        placeholder="6자 이상 입력해주세요"
      />

      {/* 비밀번호 확인 */}
      <Input
        type="password"
        label="비밀번호 확인"
        name="password_confirm"
        register={register}
        errors={errors}
      />

      {/* 전화번호 */}
      <div className="mb-4">
        <label className="block mb-1">휴대폰</label>
        <input
          {...register("phone")}
          onChange={(e) => {
            const formatted = formatPhone(e.target.value);
            setValue("phone", formatted);
          }}
          className="w-full border rounded px-3 py-2"
          placeholder="010-1234-5678"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* 생년월일 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">생년월일 (8자리)</label>
        <input
          type="text"
          maxLength={8}
          placeholder="예: 19991231"
          {...register("birth")}
          onChange={(e) => {
            let onlyNums = e.target.value.replace(/[^0-9]/g, "");
            setValue("birth", onlyNums);
          }}
          className="w-full border rounded-md px-3 py-2"
        />

        {errors.birth && (
          <p className="text-red-500 text-sm mt-1">{errors.birth.message}</p>
        )}
      </div>

      {/* 주소검색 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">우편번호</label>

        <div className="flex w-full gap-2">
          <input
            type="text"
            {...register("zipcode")}
            readOnly
            placeholder="00000"
            className="flex-1 border rounded-md px-3 py-2"
          />

          <button
            type="button"
            onClick={handleOpenPostcode}
            className="px-4 py-2 bg-black text-white rounded-md whitespace-nowrap"
          >
            검색
          </button>
        </div>

        {errors.zipcode && (
          <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>
        )}
      </div>

      <Input
        label="기본 주소"
        name="basic_address"
        register={register}
        errors={errors}
      />
      <Input
        label="상세 주소"
        name="detail_address"
        register={register}
        errors={errors}
        required={false}
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded mt-4"
      >
        {loading ? "처리중..." : "회원가입"}
      </button>
    </form>
  );
}

// =======================
// 공통 Input
// =======================
function Input({ label, name, register, errors, type = "text", required = true, placeholder="", }) {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full border rounded px-3 py-2"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
