import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  "/images/slide1.jpeg",
  "/images/slide2.jpeg",
  "/images/slide3.jpeg",
  "/images/1.jpeg",
  "/images/6.jpeg",
  "/images/2.jpeg",
  "/images/4.jpeg",
];

export default function Gallery() {
  return (
    <section className="w-full py-16 px-2 bg-[#dbcabe] flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-[#5c4634] text-center font-serif tracking-wide">Galeri Foto Kami</h2>
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-xl bg-[#fff6ed] p-6">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          grabCursor={true}
          className="gallery-swiper"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={src}
                alt={`Galeri ${idx + 1}`}
                className="w-full h-80 object-cover rounded-xl shadow-md"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
} 