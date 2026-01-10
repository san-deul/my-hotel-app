// src/components/admin/sales/SalesSummary.jsx
export default function SalesSummary({ periodLabel, summary  }) {
  // console.log('summary-->', summary)
  if (!summary) {
    return (
      <div className="bg-white p-4 rounded border">
        불러오는 중...
      </div>
    );
  }
  //  console.log('summary-->', summary)
  const items = [
    { label: "총 매출", value:`${summary.total.toLocaleString()}원`},
    { label: "취소 금액", value: `${summary.cancelled.toLocaleString()}원`, danger: true },
    { label: "실 매출", value:`${summary.net.toLocaleString()}원` },
    { label: "예약 건수", value: `${summary.count.toLocaleString()}건`},
    { label: "평균 객실 단가", value: `${summary.avg.toLocaleString()}원` },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border space-y-3">
      <h2 className="font-semibold">
        {typeof periodLabel === "string"
          ? periodLabel
          : "매출 요약"}
      </h2>

      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.label} className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p
              className={`text-xl font-bold ${item.danger ? "text-red-500" : ""
                }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
