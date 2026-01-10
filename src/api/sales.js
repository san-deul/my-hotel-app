import { supabase } from "../lib/supabase";

export async function fetchSalesSummary({ startDate, endDate }) {

  console.log("startDate:", startDate);
  console.log("endDate:", endDate);

  const { data, error } = await supabase
    .from("reservation")
    .select("price, status")
    .gte("start_date", startDate)
    .lte("start_date", endDate);

  if (error) throw error;

  let total = 0;
  let cancelled = 0;
  let count = 0;

  data.forEach((r) => {
    total += r.price;

    if (r.status === "cancelled") {
      cancelled += r.price;
    } else {
      count += 1;
    }
  });

  const net = total - cancelled;
  const avg = count > 0 ? Math.round(net / count) : 0;

  return {
    total,
    cancelled,
    net,
    count,
    avg,
  };
}
