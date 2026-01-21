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
import { cn } from "@/lib/utils";
import { Product, Variant } from "@/lib/types";
import { BASE_URL2 } from "@/lib/api-client";

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

  // Collect all unique images
  const images = React.useMemo(() => {
    const imgs = [
      {
        id: "base",
        src: product.baseImage,
        alt: product.name,
        isBase: true,
      },
    ];

    if (product.variants) {
      product.variants.forEach((v) => {
        if (v.image && !imgs.some((img) => img.src === v.image)) {
          imgs.push({
            id: v.id,
            src: v.image,
            alt: `${product.name} - ${v.color} ${v.size}`,
            isBase: false,
          });
        }
      });
    }
    return imgs;
  }, [product]);

  // Sync with selected variant
  React.useEffect(() => {
    if (selectedVariant && selectedVariant.image && api) {
      const index = images.findIndex(
        (img) => img.src === selectedVariant.image,
      );
      if (index !== -1) {
        api.scrollTo(index);
      }
    }
  }, [selectedVariant, api, images]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `${BASE_URL2}${url}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Carousel */}
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
        opts={{
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center bg-white">
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all",
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
