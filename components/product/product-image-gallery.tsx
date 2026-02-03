"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn, constructImageUrl } from "@/lib/utils";
import { Product, Variant } from "@/lib/types";
// BASE_URL2 import removed

interface ProductImageGalleryProps {
  product: Product;
  selectedVariant: Variant | null;
}

export function ProductImageGallery({
  product,
  selectedVariant,
}: ProductImageGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }),
  );

  // DEBUG: Print product data to console
  console.log("ProductImageGallery - Product:", product);
  console.log("ProductImageGallery - BaseImage:", product.baseImage);
  console.log("ProductImageGallery - Images:", product.images);

  const images = React.useMemo(() => {
    if (!product.images || product.images.length === 0) {
      return product.baseImage
        ? [
            {
              id: "base",
              src: product.baseImage,
              alt: product.name,
              isBase: true,
            },
          ]
        : [];
    }

    return product.images.map((img, index) => ({
      id: `img-${index}`,
      src: img,
      alt: `${product.name} - View ${index + 1}`,
      isBase: index === 0,
    }));
  }, [product]);

  React.useEffect(() => {
    if (selectedVariant && selectedVariant.image && api) {
      const index = images.findIndex((img) =>
        img.src.includes(selectedVariant.image!),
      );
      if (index !== -1) {
        api.scrollTo(index);
      }
    }
  }, [selectedVariant, api, images]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    if (api) api.scrollTo(index);
  };

  const getImageUrl = (url: string) => {
    return constructImageUrl(url);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Carousel */}
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {images.map((image, index) => (
            <CarouselItem key={image.id} className="pl-0">
              <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center bg-white">
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.alt}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Hide arrows on very small screens, show on tablet+ */}
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-gray-200 h-8 w-8 sm:h-10 sm:w-10" />
            <CarouselNext className="right-2 bg-white/80 hover:bg-white border-gray-200 h-8 w-8 sm:h-10 sm:w-10" />
          </>
        )}
      </Carousel>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide w-full justify-start md:justify-center">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all",
                current === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={getImageUrl(image.src)}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
