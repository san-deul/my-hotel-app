// src/components/main/MainFacilities.jsx
import { useQuery } from "@tanstack/react-query";
import CarouselSection from "../common/CarouselSection";
import { supabase } from "../../lib/supabase";

export default function MainFacilities() {

  const getFacilityImage = (path) => {
    if (!path) return "/images/no-image.jpg";

    const { data } = supabase.storage
      .from("facility_images")
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const { data: facilities = [] } = useQuery({
    queryKey: ["facility-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select(`
          id,
          name,
          facility_img (
            upload_path,
            is_main
          )
        `)
        .order("id");
      
      console.log('data----::', data)

      if (error) throw error;

      return data.map((facility) => {
        const mainImg = facility.facility_img?.find(
          (img) => img.is_main
        );

        return {
          id: facility.facility_id,
          title: facility.name,
          image: mainImg
            ? getFacilityImage(mainImg.upload_path)
            : "/images/no-image.jpg",
        };
      });
    },
  });

  return (
    <div className="w-full">
      <CarouselSection title="부대시설 안내" items={facilities} />
    </div>
  );
}
