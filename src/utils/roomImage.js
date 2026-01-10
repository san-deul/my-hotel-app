import { supabase } from "../lib/supabase";

export function attachPublicUrlsToRoomImages(images = []) {
  return images.map((img) => {
    const { data } = supabase.storage
      .from("room_images")
      .getPublicUrl(img.upload_path);

    return {
      ...img,
      publicUrl: data.publicUrl,
    };
  });
}
