// src/pages/reserve/ReservePage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

/* =========================
 * 필수 라벨 컴포넌트
 * ========================= */
const RequiredLabel = ({ children }) => (
  <label className="block font-medium mb-1">
    {children}
    <span className="text-red-500 ml-1">*</span>
  </label>
);

export default function ReservePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  /* =========================
   * URL 파라미터
   * ========================= */
  const roomNo = params.get("room_no");
  const start = params.get("start");
  const end = params.get("end");
  const adult = Number(params.get("adult"));
  const child = Number(params.get("child"));



  /* =========================
   * 폼 상태
   * ========================= */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    cardNo: "",
    cardExpYear: "",
    cardExpMonth: "",
    birth: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
   * 로그인 사용자 정보 자동 세팅
   * ========================= */
  useEffect(() => {
    const loadUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: member } = await supabase
        .from("member")
        .select("name, phone, email")
        .eq("id", user.id)
        .single();

      if (member) {
        setForm((prev) => ({
          ...prev,
          name: member.name ?? "",
          phone: member.phone ?? "",
          email: member.email ?? "",
        }));
      }
    };

    loadUserInfo();
  }, []);

  /* =========================
   * 객실 정보 조회
   * ========================= */
  const { data: room, isLoading } = useQuery({
    queryKey: ["reserve-room", roomNo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room")
        .select(`
          room_no,
          room_name,
          price,
          guest_count,
          room_img(
          upload_path)
          `)
        .eq("room_no", roomNo)
        .single();

      if (error) throw error;
      console.log('data->', data);
      return data;
    },
    enabled: !!roomNo,
  });


  const getRoomImage = (path) => {
    if (!path) return "https://via.placeholder.com/600x400";

    const { data } = supabase.storage
      .from("room_images")
      .getPublicUrl(path);

    return data.publicUrl;
  };


  if (isLoading) return <div className="p-10">로딩중...</div>;

  /* =========================
   * 결제하기
   * ========================= */
  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.email) {
      alert("필수 입력 항목을 모두 입력해주세요.");
      return;
    }

    if (!form.agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    navigate(
      `/payment?room_no=${roomNo}&start=${start}&end=${end}&adult=${adult}&child=${child}`,
      { state: { customer: form } }
    );
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 pt-6 lg:pt-10 pb-20 px-4 lg:px-0">
      {/* =======================
          좌측: 예약 폼
      ======================= */}
      <div className="flex-1 space-y-10">
        {/* 예약 고객 정보 */}
        <section className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-1">예약 고객 정보 입력</h2>
          <p className="text-sm text-gray-500 mb-6">* 필수 입력 항목입니다.</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <RequiredLabel>성명 (한글)</RequiredLabel>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                placeholder="홍길동"
              />
            </div>

            <div>
              <RequiredLabel>연락처</RequiredLabel>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                placeholder="01012341234"
              />
            </div>

            <div className="col-span-2">
              <RequiredLabel>이메일</RequiredLabel>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                placeholder="example@email.com"
              />
            </div>
          </div>
        </section>

        {/* 카드 정보 */}
        <section className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-6">신용카드 정보 입력</h2>

          <div className="space-y-4">
            <div>
              <RequiredLabel>카드번호</RequiredLabel>
              <input
                name="cardNo"
                value={form.cardNo}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                placeholder="0000-0000-0000-0000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <RequiredLabel>유효기간(년)</RequiredLabel>
                <input
                  name="cardExpYear"
                  value={form.cardExpYear}
                  onChange={handleChange}
                  className="border p-3 rounded w-full"
                  placeholder="2025"
                />
              </div>
              <div>
                <RequiredLabel>유효기간(월)</RequiredLabel>
                <input
                  name="cardExpMonth"
                  value={form.cardExpMonth}
                  onChange={handleChange}
                  className="border p-3 rounded w-full"
                  placeholder="12"
                />
              </div>
            </div>

            <div>
              <RequiredLabel>생년월일(6자리)</RequiredLabel>
              <input
                name="birth"
                value={form.birth}
                onChange={handleChange}
                className="border p-3 rounded w-full"
                placeholder="900101"
              />
            </div>
          </div>
        </section>

        {/* 취소 규정 */}
        <section className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">취소 규정</h2>
          <p className="text-gray-600 leading-relaxed">
            • 당일 예약의 경우 예약 완료와 동시에 취소 및 변경이 불가합니다.
            <br />
            • 노쇼(No-Show) 발생 시 동일한 위약금이 청구될 수 있습니다.
          </p>
        </section>

        {/* 개인정보 동의 */}
        <section className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">
            개인정보 수집 및 활용 동의
          </h2>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <span className="font-medium">
              [필수] 개인정보 수집 및 이용에 동의합니다.
            </span>
          </label>
        </section>

        {/* 결제 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#3c2b27] text-white py-4 rounded-xl text-lg font-semibold cursor-pointer"
        >
          결제하기
        </button>
      </div>

      {/* =======================
          우측: 예약 요약
      ======================= */}
      <aside className="
        w-full lg:w-80
        bg-white border rounded-xl p-5 shadow
        h-fit
        static lg:sticky lg:top-10
        order-first lg:order-last">
        <img
          src={getRoomImage(room?.room_img?.[0]?.upload_path)}
          className="w-full h-40 object-cover rounded mb-4"
        />

        <h3 className="text-xl font-semibold mb-2">{room.room_name}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {start} ~ {end} <br />
          성인 {adult} / 아동 {child}
        </p>

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-bold">
          <span>총 결제금액</span>
          <span>{room.price?.toLocaleString()}원</span>
        </div>
      </aside>
    </div>
  );
}
