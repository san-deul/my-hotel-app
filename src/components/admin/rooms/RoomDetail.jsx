import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { useState } from "react";

const schema = yup.object({
  room_name: yup.string().required("객실명은 필수입니다."),
  info: yup.string(), // 선택값
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
    .required("객실 수는 필수입니다."),
});

export default function RoomDetail({ room }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // =============================
  // 이미지 목록 가져오기
  // =============================
  const { data: images } = useQuery({
    queryKey: ["room-images", room.room_no],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room_img")
        .select("*")
        .eq("room_no", room.room_no);
      if (error) throw error;
      return data;
    },
  });

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
      room_name: room.room_name,
      info: room.info,
      price: room.price,
      guest_count: room.guest_count,
      total_room: room.total_room,
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
        .eq("room_no", room.room_no);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["room-categories"]);
      alert("수정완료!");
    },
  });

  // =============================
  // 이미지 업로드
  // =============================
  const uploadImage = async (file) => {
    setUploading(true);

    const filePath = `${room.room_no}/${Date.now()}-${file.name}`;

    const { error: storageError } = await supabase.storage
      .from("room_images")
      .upload(filePath, file);

    if (storageError) {
      alert("업로드 실패");
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("room_img").insert({
      room_no: room.room_no,
      room_img_name: file.name,
      filesystem_name: filePath,
      upload_path: filePath,
    });

    if (dbError) {
      console.error("DB ERROR:", dbError);
      alert("DB Insert 실패");
      setUploading(false);
      return;
    }

    queryClient.invalidateQueries(["room-images", room.room_no]);
    setUploading(false);
  };

  // =============================
  // 이미지 삭제
  // =============================
  const deleteImage = async (img) => {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;

    await supabase.storage.from("room_images").remove([img.upload_path]);

    await supabase
      .from("room_img")
      .delete()
      .eq("room_img_no", img.room_img_no);

    queryClient.invalidateQueries(["room-images", room.room_no]);
  };

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

        {/* 설명 */}
        <div>
          <label className="block font-semibold mb-1">객실설명</label>
          <textarea className="border p-2 w-full h-24" {...register("info")} />
        </div>

        {/* 가격 */}
        <div>
          <label className="block font-semibold mb-1">가격</label>
          <input className="border p-2 w-full" {...register("price")} />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* 인원수 */}
        <div>
          <label className="block font-semibold mb-1">인원수</label>
          <input className="border p-2 w-full" {...register("guest_count")} />
          {errors.guest_count && (
            <p className="text-red-500 text-sm">{errors.guest_count.message}</p>
          )}
        </div>

        {/* 객실 수 */}
        <div>
          <label className="block font-semibold mb-1">객실 수</label>
          <input className="border p-2 w-full" {...register("total_room")} />
          {errors.total_room && (
            <p className="text-red-500 text-sm">{errors.total_room.message}</p>
          )}
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          수정완료
        </button>
      </form>

      {/* 이미지 목록 */}
      <h3 className="text-lg font-bold mt-8">이미지 목록</h3>

      <div className="flex gap-4 mt-3 flex-wrap">
        {images?.map((img) => {
          const { data } = supabase.storage
            .from("room_images")
            .getPublicUrl(img.upload_path);

          return (
            <div key={img.room_img_no} className="relative">
              <img
                src={data.publicUrl}
                className="w-32 h-32 object-cover border rounded"
              />
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
          id="upload-input"
          className="hidden"
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => document.getElementById("upload-input").click()}
        >
          {uploading ? "업로드 중..." : "이미지 업로드"}
        </button>
      </div>
    </div>
  );
}
