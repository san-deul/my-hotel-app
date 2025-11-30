// src/hooks/useRoomsQuery.js
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useRoomsQuery() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room")
        .select("room_no, room_name, parent_name, depth")
        .order("room_no", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}
