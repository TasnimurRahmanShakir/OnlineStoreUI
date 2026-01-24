"use client";

// import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ProductCard, ProductCardProps } from "@/components/main/product-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BASE_URL2 } from "@/lib/api-constants";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

interface ProductShowcaseSectionProps {
  title: string;
  viewAllLink?: string;
  products: any[];
  className?: string;
}

export function ProductShowcaseSection({
  title,
  viewAllLink = "/products",
  products,
  className,
}: ProductShowcaseSectionProps) {
  return (
    <section className={cn("py-12 relative min-h-[400px]", className)}>
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          <div className="flex items-center gap-4">
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="hidden md:flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            )}

            {/* Custom Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={`swiper-prev-${title.replace(/\s+/g, "-")} rounded-full h-8 w-8 md:h-10 md:w-10 border-gray-200`}
                disabled={products.length === 0}
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`swiper-next-${title.replace(/\s+/g, "-")} rounded-full h-8 w-8 md:h-10 md:w-10 border-gray-200`}
                disabled={products.length === 0}
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {products.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            navigation={{
              nextEl: `.swiper-next-${title.replace(/\s+/g, "-")}`,
              prevEl: `.swiper-prev-${title.replace(/\s+/g, "-")}`,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: true, // Pause on hover/interaction as requested
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
              },
              768: {
                slidesPerView: 3.2,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            className="w-full overflow-visible"
          >
            {products.map((product, index) => (
              <SwiperSlide key={product.id || index} className="h-auto">
                <ProductCard
                  product={product}
                  index={index}
                  // Add mock badges for demo
                  className="h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No products found in this section.
          </div>
        )}
      </div>
    </section>
  );
}
