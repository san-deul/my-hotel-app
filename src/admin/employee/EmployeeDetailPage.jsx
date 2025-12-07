export default function EmployeeDetailPage() {
  const { id } = useParams();

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("member").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">직원 상세 정보</h1>

      <div className="space-y-2">
        <p><strong>이름:</strong> {employee.name}</p>
        <p><strong>이메일:</strong> {employee.email}</p>
        <p><strong>전화번호:</strong> {employee.phone}</p>
        <p><strong>권한:</strong> {employee.role}</p>
        <p><strong>작성일:</strong> {employee.created_at}</p>
      </div>

      <div className="mt-4 space-x-3">
        <Link to={`/admin/employees/${employee.id}/edit`} className="bg-blue-500 text-white p-2 rounded">
          수정하기
        </Link>
        <Link to="/admin/employees" className="bg-gray-300 p-2 rounded">
          목록으로
        </Link>
      </div>
    </div>
  );
}
