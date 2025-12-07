import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export default function AddCategoryForm() {
  const [selectedNo, setSelectedNo] = useState("");
  const [roomName, setRoomName] = useState("");

  const queryClient = useQueryClient();

  // 대분류 리스트 가져오기
  const { data: categories } = useQuery({
    queryKey: ["room-category-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room")
        .select("room_no")
        .eq("depth", 0);

      if (error) throw error;
      return data;
    },
  });

  const possibleNumbers = [200, 300, 400, 500, 600, 700, 800, 900];
  const existing = categories?.map((c) => c.room_no) ?? [];
  const availableNumbers = possibleNumbers.filter(
    (num) => !existing.includes(num)
  );

  // 🔥 insert mutation
  const addCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!selectedNo || !roomName.trim()) {
        throw new Error("필수 항목을 입력해주세요");
      }

      const { error } = await supabase.from("room").insert({
        room_no: selectedNo,
        room_name: roomName,
        depth: 0,
        parent_name: "",  // 대분류라 빈 값
      });

      if (error) throw error;
    },

    onSuccess: () => {
      alert("대분류가 추가되었습니다!");
      queryClient.invalidateQueries(["room-category-list"]);
      queryClient.invalidateQueries(["room-categories"]);

      setSelectedNo("");
      setRoomName("");
    },

    onError: (err) => {
      alert("추가 중 오류: " + err.message);
    },
  });

  return (
    <div className="mt-10 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-3">객실 대분류 추가하기 ▼</h3>

      <select
        value={selectedNo}
        onChange={(e) => setSelectedNo(Number(e.target.value))}
        className="border px-2 py-1"
      >
        <option value="">번호 선택</option>
        {availableNumbers.map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="객실명"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="border ml-2 px-2 py-1"
      />

      <button
        onClick={() => addCategoryMutation.mutate()}
        className="ml-2 border px-3 py-1 bg-gray-200"
      >
        대분류 추가하기
      </button>
    </div>
  );
}
