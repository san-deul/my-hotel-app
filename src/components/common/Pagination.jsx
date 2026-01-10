export default function Pagination({ total, page, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`px-3 py-1 rounded ${
            page === i + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}


/*

Arrays.from : 
map((_, i)) => _ 는 사용하지 않는 변수를 의미하는 관습적인 이름

*/