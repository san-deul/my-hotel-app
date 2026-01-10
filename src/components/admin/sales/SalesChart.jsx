import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";

export default function SalesChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(item =>
      dayjs(item.date).format("MM/DD")
    ),
    datasets: [
      {
        label: "매출",
        data: data.map(item => item.total_amount),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: value => value.toLocaleString() + "원",
        },
      },
    },
  };

  return <Bar data={chartData} options={options}  redraw={true} />;
}
