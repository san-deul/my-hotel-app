import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { useState } from "react";

const schema = yup.object({
  room_name: yup.string().required("객실명은 필수입니다."),
  info: yup.string(), // 선택값

});

export default function CategoryDetail({ category }) {
  const queryClient = useQueryClient();

  // =============================
  // react-hook-form + yupResolver
  // =============================
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      room_name: category.room_name,
    },
  });

  // =============================
  // 객실 업데이트
  // =============================
  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from("room")
        .update(values)
        .eq("room_no", category.room_no);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["room-categories"]);
      alert("수정완료!");
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">객실 상세정보</h2>

      <form
        onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
        className="space-y-4"
      >
        {/* 객실명 */}
        <div>
          <label className="block font-semibold mb-1">객실명</label>
          <input className="border p-2 w-full" {...register("room_name")} />
          {errors.room_name && (
            <p className="text-red-500 text-sm">{errors.room_name.message}</p>
          )}
        </div>

        <button className="bg-[#696cff] text-white px-4 py-2 rounded">
          수정완료
        </button>
      </form>


      {/* 업로드 */}
      <div className="mt-4">
        <input
          type="file"
          id="upload-input"
          className="hidden"
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        
      </div>
    </div>
  );
}
