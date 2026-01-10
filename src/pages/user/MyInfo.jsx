// src/pages/MyPage.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../lib/supabase";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// =======================
// Yup Schema (회원가입과 동일하게 정교하게 수정!)
// =======================
const schema = yup.object({
  name: yup.string().required("이름을 입력해주세요."),
  phone: yup.string().required("휴대폰 번호를 입력해주세요."),

  birth: yup
    .string()
    .required("생년월일을 입력해주세요.")
    .test("len", "생년월일은 8자리 숫자여야 합니다.", (value) => {
      return value && /^[0-9]{8}$/.test(value);
    })
    .test("valid-date", "올바른 날짜가 아닙니다.", (value) => {
      if (!value || value.length !== 8) return false;

      const year = Number(value.slice(0, 4));
      const month = Number(value.slice(4, 6));
      const day = Number(value.slice(6, 8));

      const date = new Date(year, month - 1, day);

      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      );
    }),

  zipcode: yup.string().required("우편번호를 입력해주세요."),
  basic_address: yup.string().required("기본 주소를 입력해주세요."),
  detail_address: yup.string(),
});

export default function MyInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const openDaumPopup = useDaumPostcodePopup();

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // =======================
  // 전화번호 포맷
  // =======================
  const formatPhone = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, "");

    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
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

  const handleOpenPostcode = () => {
    openDaumPostcodePopup({ onComplete: handlePostcodeComplete });
  };

  // =======================
  // 회원 정보 불러오기 + birth/phone 포맷 적용
  // =======================
  useEffect(() => {
    const loadUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: member } = await supabase
        .from("member")
        .select("*")
        .eq("id", user.id)
        .single();

      if (member) {
        reset({
          ...member,
          phone: formatPhone(member.phone || ""),
          birth: member.birth?.replace(/-/g, "") || "", // ← 회원가입과 동일하게 8자리 숫자로 변환!
        });
      }
    };

    loadUserInfo();
  }, [reset]);

  // =======================
  // 정보 수정 저장
  // =======================
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("member")
        .update({
          name: data.name,
          phone: data.phone,
          birth: data.birth,
          zipcode: data.zipcode,
          basic_address: data.basic_address,
          detail_address: data.detail_address,
        })
        .eq("id", user.id);

      if (error) throw error;

      alert("회원 정보가 수정되었습니다!");
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-lg mx-auto mt-10 min-h-screen"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">마이페이지</h2>

      {/* 이메일 (읽기 전용) */}
      <div className="mb-4">
        <label className="block mb-1">이메일</label>
        <input
          className="w-full border rounded px-3 py-2 bg-gray-100"
          disabled
          {...register("email")}
        />
      </div>

      <Input label="이름" name="name" register={register} errors={errors} />

      {/* 전화번호 */}
      <div className="mb-4">
        <label className="block mb-1">휴대폰</label>
        <input
          {...register("phone")}
          onChange={(e) => setValue("phone", formatPhone(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* 생년월일 */}
      <div className="mb-4">
        <label className="block mb-1">생년월일 (8자리)</label>
        <input
          {...register("birth")}
          maxLength={8}
          onChange={(e) => {
            let onlyNums = e.target.value.replace(/[^0-9]/g, "");
            setValue("birth", onlyNums);
          }}
          className="w-full border rounded px-3 py-2"
        />

        {errors.birth && (
          <p className="text-red-500 text-sm mt-1">
            {errors.birth.message}
          </p>
        )}
      </div>

      {/* 주소 */}
      <div className="mb-4">
        <label className="block mb-1">우편번호</label>

        <div className="flex w-full gap-2">
          <input
            {...register("zipcode")}
            readOnly
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
          <p className="text-red-500 text-sm mt-1">
            {errors.zipcode.message}
          </p>
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

      {/* 정보 수정 버튼 */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded mt-4"
      >
        {loading ? "저장중..." : "정보 수정"}
      </button>

      {/* 비밀번호 수정 버튼 */}
      <button
        type="button"
        onClick={() => navigate("/change-password")}
        className="w-full bg-black text-white py-3 rounded mt-2
        hover:bg-[#a67c52] hover:shadow-lg transition duration-200"
      >
        비밀번호 수정
      </button>
    </form>
  );
}

// =======================
// 공통 Input 컴포넌트
// =======================
function Input({ label, name, register, errors, type = "text", placeholder="" }) {
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
