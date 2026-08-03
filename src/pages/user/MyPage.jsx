// src/pages/MyPage.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../lib/supabase";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";



export default function MyPage() {

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">마이페이지</h2>
      <ul className="divide-y pt-5">
        <li className="w-full bg-black text-white py-3 rounded mt-4 h-12 hover:bg-[#a67c52] hover:shadow-lg transition duration-200">
          <Link to="/myinfo/" className="block pl-5">
            내 정보 수정
          </Link>
        </li>
        <li className="w-full bg-black text-white py-3 rounded mt-4 h-12 hover:bg-[#a67c52] hover:shadow-lg transition duration-200">
          <Link to="/myReservation" className="block pl-5">
            예약 목록
          </Link>
        </li>
        <li className="w-full bg-black text-white py-3 rounded mt-4 h-12 hover:bg-[#a67c52] hover:shadow-lg transition duration-200">
          <a href="/myFavorites" className="block pl-5">
            찜 목록
          </a>
        </li>
      </ul>
    </div>
  );
}

// =======================
// 공통 Input 컴포넌트
// =======================
/*
function Input({ label, name, register, errors, type = "text", placeholder = "" }) {
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
*/