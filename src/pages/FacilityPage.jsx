// src/pages/FacilityPage.jsx

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import FaciNav from "../components/rooms/FaciNav";
import FacilityCard from "../components/facility/FacilityCard";

export default function FacilityPage() {
  const [facilities, setFacilities] = useState([]);
  const [images, setImages] = useState([]);
  

  useEffect(() => {
    const load = async () => {
      // 1) 부대시설 조회
      const { data: faciData } = await supabase
        .from("facilities")
        .select("*")
        .order("id");

      // 2) 부대시설 이미지 조회
      const { data: imgData } = await supabase
        .from("facility_img")
        .select("*");

      setFacilities(faciData || []);
      setImages(imgData || []);
      setIsLoading(false);
    };

    load();
  }, []);

  // ================================
  // ⭐ facility_id 기준 대표 이미지
  // ================================
  const getFacilityImage = (facilityId) => {
    const img = images.find(
      
      (i) => i.facility_id === facilityId && i.is_main === true
    );
    if (!img) return "https://via.placeholder.com/600x400";

    const { data } = supabase.storage
      .from("facility_images")
      .getPublicUrl(img.upload_path);

    return data.publicUrl;
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
      {/* 좌측 네비 */}
      <FaciNav />

      {/* 본문 */}
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-serif mb-10">부대시설</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {facilities.map((faci, index) => (
            <FacilityCard
              key={faci.id}
              id={faci.id}
              name={faci.name}
              description={faci.description}
              image={getFacilityImage(faci.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
