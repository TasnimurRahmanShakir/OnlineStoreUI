"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: "Premium Tech Collection",
    subtitle: "Upgrade your workflow with our latest gadgets",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    color: "from-[#2563eb]/90 to-[#9333ea]/90",
  },
  {
    id: 2,
    title: "Next-Gen Audio",
    subtitle: "Immersive sound that goes everywhere with you",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    color: "from-[#059669]/90 to-[#0d9488]/90",
  },
  {
    id: 3,
    title: "Smart Home Hub",
    subtitle: "Control your environment with a single touch",
    image:
      "https://images.unsplash.com/photo-1558002038-109177381792?q=80&w=2070&auto=format&fit=crop",
    color: "from-[#ea580c]/90 to-[#dc2626]/90",
  },
];

export function HeroSection() {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const animateSlide = (index: number) => {
    const activeSlide = slideRefs.current[index];
    if (!activeSlide) return;

    const title = activeSlide.querySelector(".hero-title");
    const subtitle = activeSlide.querySelector(".hero-subtitle");
    const btn = activeSlide.querySelector(".hero-btn");

    gsap.fromTo(
      [title, subtitle, btn],
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2, // Wait for slide transition
      },
    );
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-background py-8">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        speed={1000}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        onSlideChange={(swiper) => animateSlide(swiper.realIndex)}
        onSwiper={(swiper) => animateSlide(swiper.realIndex)}
        className="h-full w-full group [&_.swiper-pagination-bullet]:w-3 [&_.swiper-pagination-bullet]:h-3 [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-primary! [&_.swiper-pagination-bullet-active]:w-8! [&_.swiper-pagination-bullet-active]:rounded-full! [&_.swiper-pagination-bullet-active]:transition-all"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="relative h-full w-full flex items-center justify-center bg-gray-900"
            >
              {/* Background Image (Blurred for fill) */}
              <div className="absolute inset-0 opacity-30">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover blur-xl"
                  priority={index === 0}
                />
              </div>

              {/* Main Image (Contained) */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
                {/* Overlay gradient */}
                <div
                  className={`absolute inset-0 bg-linear-to-r ${slide.color} mix-blend-multiply opacity-60`}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content */}
              <div className="container relative z-10 px-4 md:px-6">
                <div className="max-w-2xl text-white space-y-6">
                  <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight opacity-0 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="hero-subtitle text-lg md:text-xl lg:text-2xl text-white/90 font-medium max-w-[600px] opacity-0 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <div className="hero-btn opacity-0 pt-4">
                    <Button
                      size="lg"
                      className="gap-2 text-base h-12 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300"
                    >
                      Shop Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
