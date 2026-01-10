// src/components/admin/sales/SalesHeader.jsx (수정)
import { useQuery } from "@tanstack/react-query";


export default function SalesHeader({ startDate, endDate, onToday, onMonth }) {
  const { data, isLoading } = useQuery({
    queryKey: ["sales-summary", startDate, endDate],
    queryFn: () => fetchSalesSummary(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  return (
    <div className="space-y-6">
      {/* 상단 컨트롤 */}
      <div className="bg-white" >
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={onToday} className="px-4 py-2 bg-white border rounded hover:bg-gray-50">
              오늘
            </button>
            <button onClick={onMonth} className="px-4 py-2 bg-white border rounded hover:bg-gray-50">
              이번달
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {startDate} ~ {endDate}
            </span>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded hover:bg-gray-50">

              엑셀 다운받기
            </button>
          </div>
        </div>

        {/* 메인 통계 카드들 */}
        <div className="grid grid-cols-5 gap-4">
          <MainRevenueCard data={data} loading={isLoading} />
          <MetricCard
            title="객실 평균 판매금액"
            subtitle="ADR"
            value={data?.adRevenue}
            loading={isLoading}
            details={data?.adDetails}
          />
          <MetricCard
            title="객실 가동률"
            subtitle="Occupancy"
            value={data?.occupancy}
            isPercent
            loading={isLoading}
            details={data?.occupancyDetails}
          />
          <MetricCard
            title="예약 리드타임"
            subtitle="Leadtime"
            value={data?.leadtime}
            unit="일전 예약"
            loading={isLoading}
            details={data?.leadtimeDetails}
          />
          <MetricCard
            title="취소율"
            subtitle="Cancel ratio"
            value={data?.cancelRate}
            isPercent
            loading={isLoading}
            details={data?.cancelDetails}
          />
        </div>z
      </div>

    </div>
  );
}

function MainRevenueCard({ data, loading }) {
  if (loading) {
    return <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse h-48" />;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-sm text-gray-600 mb-2">이달의 누적 판매금액</div>
      <div className="text-3xl font-bold text-blue-600 mb-1">
        {data?.totalRevenue?.toLocaleString() || 0}원
      </div>
      <div className="text-xs text-gray-500 mb-3">
        작년 동기대비 {data?.lastYearRevenue?.toLocaleString() || 0} ▲
      </div>

      <div className="space-y-2 text-sm border-t pt-3">
        <div className="flex justify-between">
          <span className="text-gray-600">예약</span>
          <div>
            <span className="text-gray-400 mr-2">{data?.bookingCount || 0}건</span>
            <span className="font-semibold">
              {data?.bookingRevenue?.toLocaleString() || 0}원
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">취소 수수료</span>
          <div>
            <span className="text-gray-400 mr-2">{data?.cancelCount || 0}건</span>
            <span className="font-semibold">
              {data?.cancelFee?.toLocaleString() || 0}원
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        환율사 규정에 따라 취소 수수료를 금액이 달라질 수 있습니다.
      </div>
    </div>
  );
}

function MetricCard({ title, subtitle, value, isPercent, unit, loading, details }) {
  if (loading) {
    return <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse h-48" />;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-xs text-gray-400 mb-2">{subtitle}</div>
      <div className="text-2xl font-bold text-blue-600 mb-3">
        {isPercent
          ? `${value || 0}%`
          : unit
            ? `입실 ${value || 0}`
            : `${value?.toLocaleString() || 0}원`}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>

      {details && (
        <div className="space-y-2 text-sm border-t pt-3">
          {details.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold">
                {item.value || item.rate || item.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}