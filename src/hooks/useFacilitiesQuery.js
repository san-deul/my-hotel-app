import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const fetchFacilities = async () => {
  const { data, error } = await supabase
    .from("facilities")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
};

export const useFacilitiesQuery = () => {
  return useQuery({
    queryKey: ["facilities"],
    queryFn: fetchFacilities,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
