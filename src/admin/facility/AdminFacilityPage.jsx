import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import AddFacilityForm from "../../components/admin/facility/AddFacilityForm";
import FacilityDetail from "../../components/admin/facility/FacilityDetail";

export default function AdminFacilityPage() {
  const [selectedFaci, setSelectedFaci] = useState(null);
  const queryClient = useQueryClient();

  const { data: facilities, isLoading } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleDeleteFacility = async (facility) => {
    if (!confirm(`"${facility.name}" 부대시설을 삭제할까요?`)) return;

    try {
      // 1. 이미지 목록 가져오기
      const { data: images, error: imgError } = await supabase
        .from("facility_img")
        .select("upload_path")
        .eq("facility_id", facility.id);

      if (imgError) throw imgError;

      // 2. storage 이미지 삭제
      if (images?.length > 0) {
        const paths = images.map(img => img.upload_path);

        const { error: storageError } = await supabase.storage
          .from("facility_images")
          .remove(paths);

        if (storageError) throw storageError;
      }

      // 3. 부대시설 삭제 (CASCADE)
      const { error } = await supabase
        .from("facilities")
        .delete()
        .eq("id", facility.id);

      if (error) throw error;

      // 4. 선택 해제
      if (selectedFaci?.id === facility.id) {
        setSelectedFaci(null);
      }

      alert("삭제되었습니다.");

      queryClient.invalidateQueries(["facilities"]);

    } catch (e) {
      console.error(e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };


  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* 부대시설 목록 */}
        <div className="w-1/3 bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-3">부대시설 목록</h2>

          <ul className="space-y-2">
            {facilities.map((faci) => (
              <li
                key={faci.id}
                onClick={() => setSelectedFaci(faci)}
                className={`flex justify-between items-center p-2 border rounded cursor-pointer
                        ${selectedFaci?.id === faci.id ? "bg-gray-100" : ""}
                      `}
              >
                <span>{faci.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ⭐ 선택 이벤트 막기
                    handleDeleteFacility(faci);
                  }}
                  className="text-red-500 font-bold px-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 우측 상세 */}
        <div className="flex-1 bg-white p-4 shadow rounded">
          {selectedFaci ? (
            <FacilityDetail facility={selectedFaci} />
          ) : (
            <div className="text-gray-400">
              부대시설을 선택해주세요
            </div>
          )}
        </div>
      </div>

      <AddFacilityForm />
    </div>
  );
}
