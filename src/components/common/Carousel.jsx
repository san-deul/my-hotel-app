import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

//css
import "../../styles/swiper-mainvisual.css"

const Carousel = ({ images }) => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      //autoplay={{ delay: 3000, disableOnInteraction: false }}
      effect="fade"
      pagination={{ clickable: true }}
      navigation={true}
      loop={true}
      className="w-full h-full visual-swiper"
    >
      {images?.map((img) => (
        <SwiperSlide key={img.id}>
          <img
            src={img.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
