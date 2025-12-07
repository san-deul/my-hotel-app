import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

// =============================
// Yup Schema
// =============================
const schema = yup.object({
  parentNo: yup.string().required("대분류를 선택해주세요."),
  room_name: yup.string().required("객실명을 입력해주세요."),
  info: yup.string(),
  price: yup
    .number()
    .typeError("가격은 숫자만 입력 가능합니다.")
    .required("가격은 필수입니다."),
  guest_count: yup
    .number()
    .typeError("인원수는 숫자만 입력 가능합니다.")
    .required("인원수는 필수입니다."),
  total_room: yup
    .number()
    .typeError("객실 수는 숫자만 입력 가능합니다.")
    .required("객실 수는 필수입니다.")
});

export default function AddRoomForm() {
  const queryClient = useQueryClient();

  // =============================
  // react-hook-form
  // =============================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  const parentNo = watch("parentNo");

  // =============================
  // 1) depth = 0 대분류 가져오기
  // =============================
  const { data: categories } = useQuery({
    queryKey: ["room-category-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room")
        .select("*")
        .eq("depth", 0);

      if (error) throw error;
      return data.sort((a, b) => a.room_no - b.room_no);
    }
  });

  // =============================
  // 2) 선택 대분류의 하위 객실 조회
  // =============================
  const { data: childRooms } = useQuery({
    queryKey: ["child-rooms", parentNo],
    enabled: !!parentNo,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room")
        .select("*")
        .eq("depth", 1)
        .eq("parent_name", parentNo);

      if (error) throw error;
      return data;
    }
  });

  // =============================
  // 3) 새 room_no 계산
  // =============================
  const newRoomNo = parentNo
    ? Number(parentNo) + (childRooms?.length ?? 0) + 1
    : null;

  // =============================
  // 4) INSERT Mutation
  // =============================
  const addRoomMutation = useMutation({
    mutationFn: async (values) => {
      const { room_name, info, price, guest_count, total_room } = values;

      const { error } = await supabase.from("room").insert({
        room_no: newRoomNo,
        room_name,
        depth: 1,
        parent_name: values.parentNo,
        info,
        price,
        guest_count,
        total_room
      });

      if (error) throw error;
    },

    onSuccess: () => {
      alert("객실 유형이 추가되었습니다!");
      queryClient.invalidateQueries(["room-categories"]);
      reset();
    },

    onError: (err) => {
      alert("추가 실패: " + err.message);
    }
  });

  return (
    <div className="mt-10 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">객실유형 추가하기 ▼</h3>

      <form onSubmit={handleSubmit((values) => addRoomMutation.mutate(values))}>
        
        {/* 대분류 선택 */}
        <div>
          <select
            className="border px-2 py-1"
            {...register("parentNo")}
          >
            <option value="">대분류 선택</option>
            {categories?.map(cat => (
              <option key={cat.room_no} value={cat.room_no}>
                {cat.room_no} {cat.room_name}
              </option>
            ))}
          </select>
          {errors.parentNo && (
            <p className="text-red-500 text-sm">{errors.parentNo.message}</p>
          )}
        </div>

        {/* 객실명 */}
        <div className="mt-3">
          <label>객실명</label>
          <input className="border w-full" {...register("room_name")} />
          {errors.room_name && (
            <p className="text-red-500 text-sm">{errors.room_name.message}</p>
          )}
        </div>

        {/* 정보 */}
        <div className="mt-3">
          <label>정보</label>
          <input className="border w-full" {...register("info")} />
        </div>

        {/* 가격 */}
        <div className="mt-3">
          <label>가격</label>
          <input className="border w-full" {...register("price")} />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* 인원수 */}
        <div className="mt-3">
          <label>인원수</label>
          <input className="border w-full" {...register("guest_count")} />
          {errors.guest_count && (
            <p className="text-red-500 text-sm">{errors.guest_count.message}</p>
          )}
        </div>

        {/* 객실 수 */}
        <div className="mt-3">
          <label>객실수</label>
          <input className="border w-full" {...register("total_room")} />
          {errors.total_room && (
            <p className="text-red-500 text-sm">{errors.total_room.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 px-3 py-2 bg-blue-500 text-white rounded"
        >
          객실유형 추가하기
        </button>
      </form>
    </div>
  );
}
