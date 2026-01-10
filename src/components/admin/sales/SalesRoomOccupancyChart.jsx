// src/components/admin/sales/SalesRoomOccupancyChart.jsx
import { Doughnut } from "react-chartjs-2";

export default function SalesRoomOccupancyChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(item => `${item.roomName}`),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#06b6d4",
          "#a855f7",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "left",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const value = ctx.raw;
            const percent = ((value / total) * 100).toFixed(1);
            return `${value}건 (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative h-[320px] w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  )
  ;
}
