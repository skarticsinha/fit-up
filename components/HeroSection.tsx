// components/HeroSlider.jsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const heroImages = [
  {
    src: '/assets/heroImg1.png',
    alt: 'Medical professional in white and light blue scrubs',
    title: 'Style in Every Stitch',
    description: 'Modern fits, vibrant colors, and durable fabrics – built for the demands of healthcare.',
    imagePosition: 'right',
  },
  {
    src: '/assets/heroImg2.png',
    alt: 'Two medical professionals in red and blue scrubs',
    title: 'Comfort Meets Care',
    description: 'Premium Medical Uniforms for Everyday Heroes',
    imagePosition: 'right',
  },
  {
    src: '/assets/heroImg3.png',
    alt: 'Medical professional in light blue scrubs and mask',
    title: 'Gear Up with Confidence',
    description: 'From hospitals to home care, our uniforms deliver performance, comfort, and confidence.',
    imagePosition: 'right',
  },
];

const HeroSlider = () => {
  return (
    <div className="hero-slider-wrapper">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="mySwiper"
      >
        {heroImages.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="hero-slide-content">
              {/* Text Content */}
              <div className="hero-text-container">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-description">{slide.description}</p>

                {/* Two Buttons */}
                <div className="hero-buttons">
                  <Link href="/shop?gender=Men" className="shop-now-button">
                    MEN
                  </Link>
                  <Link href="/shop?gender=Women" className="shop-now-button">
                    WOMEN
                  </Link>
                </div>
              </div>

              {/* Image Container */}
              <div className={`hero-image-container image-${slide.imagePosition}`}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="bottom right"
                  quality={90}
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 60vw, 55vw"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        /* --- General Layout and Background Gradient --- */
        .hero-slider-wrapper {
          width: 100%;
          height: 80vh;
          position: relative;
          overflow: hidden;
          background: linear-gradient(to right, #e0f2f7, #c6e7f1);
          display: flex;
          align-items: center;
        }

        .mySwiper {
          width: 100%;
          height: 100%;
        }

        /* --- Slide Content Layout --- */
        .hero-slide-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          position: relative;
          padding: 0 8%;
          box-sizing: border-box;
        }

        /* --- Text Container --- */
        .hero-text-container {
          z-index: 10;
          color: #212529;
          max-width: 70%;
          flex-shrink: 0;
          position: relative;
          padding-left: 2%;
        }

        .hero-title {
          font-size: 3.5em;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .hero-description {
          font-size: 1.5em;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        /* --- Buttons --- */
        .hero-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .shop-now-button {
          background-color: #ffffff;
          color: #212529;
          border: 1px solid #ced4da;
          padding: 15px 30px;
          font-size: 1.2em;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
          border-radius: 5px;
          text-decoration: none;
        }

        .shop-now-button:hover {
          background-color: #e9ecef;
          border-color: #adb5bd;
        }

        /* --- Image Container --- */
        .hero-image-container {
          position: absolute;
          bottom: 0;
          right: 8%;
          width: 55%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
          margin-right: -5%;
        }

        /* --- Swiper Navigation --- */
        .swiper-button-next,
        .swiper-button-prev {
          color: #007bff;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
          top: 50%;
          transform: translateY(-50%);
        }
        .swiper-button-prev { left: 20px; }
        .swiper-button-next { right: 20px; }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(255, 255, 255, 1);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 1.5em !important;
        }

        /* --- Swiper Pagination --- */
        .swiper-pagination-bullet {
          background-color: #ced4da;
          opacity: 1;
        }

        .swiper-pagination-bullet-active {
          background-color: #007bff;
        }

        /* --- Responsive Adjustments --- */
        @media (max-width: 1024px) {
          .hero-slide-content { padding: 0 5%; }
          .hero-text-container { max-width: 50%; padding-left: 0; }
          .hero-image-container { right: 5%; width: 60%; margin-right: -3%; }
          .hero-title { font-size: 3em; }
          .hero-description { font-size: 1.3em; }
          .swiper-button-prev { left: 10px; }
          .swiper-button-next { right: 10px; }
        }

        @media (max-width: 768px) {
          .hero-slider-wrapper { height: auto; min-height: 50vh; }
          .mySwiper { height: auto; min-height: 50vh; }
          .swiper-slide {
            height: auto;
            min-height: 50vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 30px 20px 20px;
            box-sizing: border-box;
          }

          .hero-slide-content { display: contents; }

          .hero-text-container {
            max-width: 90%;
            margin-bottom: 20px;
            text-align: center;
          }
          .hero-title { font-size: 2.5em; margin-bottom: 10px; }
          .hero-description { font-size: 1.2em; margin-bottom: 20px; }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .shop-now-button {
            padding: 10px 20px;
            font-size: 1em;
            width: 100%;
            text-align: center;
          }

          .hero-image-container {
            position: relative;
            width: 100%;
            height: auto;
            margin-right: 0;
            right: auto;
            flex-grow: 1;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .hero-image-container img {
            position: relative !important;
            width: 80% !important;
            height: auto !important;
            object-fit: contain !important;
            object-position: bottom center !important;
          }

          .swiper-button-next,
          .swiper-button-prev { display: none; }
        }

        @media (max-width: 480px) {
          .hero-slider-wrapper { min-height: 40vh; }
          .mySwiper { min-height: 40vh; }
          .swiper-slide { min-height: 40vh; padding: 20px 15px 15px; }
          .hero-title { font-size: 2em; margin-bottom: 8px; }
          .hero-description { font-size: 0.9em; margin-bottom: 15px; }
          .hero-image-container img { width: 90% !important; }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
