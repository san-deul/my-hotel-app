import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

// =============================
// Yup Schema
// =============================
const schema = yup.object({
  name: yup.string().required("부대시설명을 입력해주세요."),
  description: yup.string(),
});

export default function AddFacilityForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // =============================
  // INSERT Mutation
  // =============================
  const addFacilityMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from("facilities")
        .insert(values);

      if (error) throw error;
    },

    onSuccess: () => {
      alert("부대시설이 추가되었습니다!");
      queryClient.invalidateQueries(["facilities"]);
      reset();
    },

    onError: (err) => {
      alert("추가 실패: " + err.message);
    },
  });

  return (
    <div className="mt-10 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">부대시설 추가하기 ▼</h3>

      <form onSubmit={handleSubmit(addFacilityMutation.mutate)}>
        {/* 부대시설명 */}
        <div className="mt-3">
          <label>부대시설명</label>
          <input className="border w-full" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* 설명 */}
        <div className="mt-3">
          <label>설명</label>
          <input className="border w-full" {...register("description")} />
        </div>

        <button
          type="submit"
          className="mt-4 px-3 py-2 bg-[#696cff] text-white rounded"
        >
          부대시설 추가하기
        </button>
      </form>
    </div>
  );
}
