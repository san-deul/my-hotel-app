import { supabase } from "../lib/supabase";


export const getRoomImageUrl = (path) => {

  if (!path) return "/images/no-image.jpg";
  const { data } = supabase.storage.from("room_images").getPublicUrl(path);
  return data.publicUrl;

  
};

// room 테이블에서 데이터 가져옴 
export const fetchRooms = async () => {
  
  const { data, error } = await supabase
    .from("room")
    .select(`
      *,
      room_img(*)
    `)
    .order("room_no", { ascending: true });

  if (error) throw error;
  return data;
};