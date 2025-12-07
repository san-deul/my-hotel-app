import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function EmployeeListPage() {
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member")
        .select("id, name, email, role, created_at")
        .eq("role", "manager");

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>로딩중...</div>;
  if (!employees || employees.length === 0)
    return <div>등록된 직원이 없습니다.</div>;

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    //await supabase.from("member").delete().eq("id", id);

    const res = await fetch("/api/deleteEmployee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    const result = await res.json();
    console.log(result);

    if (!result.success) {
      alert("삭제 실패: " + result.message);
      return;
    }

    queryClient.invalidateQueries(["employees"]); // 데이터 다시 가져오기
    alert("삭제가 완료되었습니다.");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h1 className="text-xl font-semibold mb-6">직원 목록</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="pb-3">이름</th>
            <th className="pb-3">이메일</th>
            <th className="pb-3">역할</th>
            <th className="pb-3">가입일</th>
            <th className="pb-3 text-center">관리</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="border-b hover:bg-gray-50 transition"
            >
              {/* 이름 */}
              <td className="py-4 font-medium text-gray-800">
                {emp.name}
              </td>

              {/* 이메일 */}
              <td className="py-4 text-gray-600">{emp.email}</td>

              {/* 역할 (태그 스타일) */}
              <td className="py-4">
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {emp.role.toUpperCase()}
                </span>
              </td>

              {/* 가입일 */}
              <td className="py-4 text-gray-500 text-sm">
                {new Date(emp.created_at).toLocaleDateString()}
              </td>

              {/* 액션 버튼 */}
              <td className="py-4 text-center">
                <div className="flex justify-center gap-3">


                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => handleDelete(emp.id)}
                  >
                    삭제
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
