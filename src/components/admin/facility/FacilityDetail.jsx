import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { useEffect, useState } from "react";

// =============================
// Yup Schema
// =============================
const schema = yup.object({
  name: yup.string().required("부대시설명은 필수입니다."),
  description: yup.string(),
});

export default function FacilityDetail({ facility }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // =============================
  // react-hook-form
  // =============================
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // =============================
  // 부대시설 정보 수정
  // =============================
  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from("facilities")
        .update(values)
        .eq("id", facility.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["facilities"]);
      alert("수정 완료!");
    },
  });

  useEffect(() => {
    if (facility) {
      reset({
        name: facility.name,
        description: facility.description,
      });
    }
  }, [facility, reset]);

  // =============================
  // 이미지 목록
  // =============================
  const { data: images } = useQuery({
    queryKey: ["facility-images", facility.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_img")
        .select("*")
        .eq("facility_id", facility.id)
        .order("is_main", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // =============================
  // 이미지 업로드
  // =============================
  const uploadImage = async (file) => {
    if (!file) return;

    setUploading(true);

    const filePath = `facility/${facility.id}/${Date.now()}-${file.name}`;

    const { error: storageError } = await supabase.storage
      .from("facility_images")
      .upload(filePath, file);

    if (storageError) {
      alert("업로드 실패");
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("facility_img").insert({
      facility_id: facility.id,
      facility_img_name: file.name,
      filesystem_name: filePath,
      upload_path: filePath,
    });

    if (dbError) {
      alert("DB Insert 실패");
      setUploading(false);
      return;
    }

    queryClient.invalidateQueries(["facility-images", facility.id]);
    setUploading(false);
  };

  // =============================
  // 이미지 삭제
  // =============================
  const deleteImage = async (img) => {
    if (!confirm("삭제할까요?")) return;

    await supabase.storage
      .from("facility_images")
      .remove([img.upload_path]);

    await supabase
      .from("facility_img")
      .delete()
      .eq("facility_img_no", img.facility_img_no);

    queryClient.invalidateQueries(["facility-images", facility.id]);
  };

  // =============================
  // 대표 이미지 설정
  // =============================
  const setMainImage = async (img) => {
    await supabase
      .from("facility_img")
      .update({ is_main: false })
      .eq("facility_id", facility.id);

    await supabase
      .from("facility_img")
      .update({ is_main: true })
      .eq("facility_img_no", img.facility_img_no);

    queryClient.invalidateQueries(["facility-images", facility.id]);
  };

  return (
    <div className="space-y-8">
      {/* =============================
          부대시설 정보 수정
         ============================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">부대시설 정보</h2>

        <form
          onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
          className="space-y-4"
        >
          <div>
            <label className="block font-semibold mb-1">부대시설명</label>
            <input
              className="border p-2 w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">설명</label>
            <textarea
              className="border p-2 w-full h-24"
              {...register("description")}
            />
          </div>

          <button className="bg-[#696cff] text-white px-4 py-2 rounded">
            수정 완료
          </button>
        </form>
      </div>

      {/* =============================
          이미지 목록
         ============================= */}
      <div>
        <h3 className="text-lg font-bold mb-3">이미지 목록</h3>

        <div className="flex gap-4 flex-wrap">
          {images?.map((img) => {
            const { data } = supabase.storage
              .from("facility_images")
              .getPublicUrl(img.upload_path);

            return (
              <div key={img.facility_img_no} className="relative">
                <img
                  src={data.publicUrl}
                  className={`w-32 h-32 object-cover border rounded
                    ${img.is_main ? "ring-4 ring-[#696cff]" : ""}`}
                />

                {img.is_main ? (
                  <span className="absolute bottom-1 left-1 bg-[#696cff] text-white text-xs px-2 rounded">
                    대표 이미지
                  </span>
                ) : (
                  <button
                    className="absolute bottom-1 right-1 bg-white text-xs px-2 rounded shadow"
                    onClick={() => setMainImage(img)}
                  >
                    대표로 설정
                  </button>
                )}

                <button
                  className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-sm px-2 rounded"
                  onClick={() => deleteImage(img)}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>

        {/* 업로드 */}
        <div className="mt-4">
          <input
            type="file"
            id="facility-upload"
            className="hidden"
            onChange={(e) => uploadImage(e.target.files[0])}
          />
          <button
            className="bg-[#696cff] text-white px-4 py-2 rounded"
            onClick={() =>
              document.getElementById("facility-upload").click()
            }
          >
            {uploading ? "업로드 중..." : "이미지 업로드"}
          </button>
        </div>
      </div>
    </div>
  );
}
