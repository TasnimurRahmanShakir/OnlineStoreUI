"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface OrderProductImageProps {
  src: string;
  alt: string;
}

export function OrderProductImage({ src, alt }: OrderProductImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative w-full h-full overflow-hidden rounded-md cursor-pointer group">
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
        <div className="relative w-full h-[80vh] flex items-center justify-center pointer-events-none">
          {/* Visually hidden title for accessibility */}
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative w-full h-full pointer-events-auto">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              quality={100}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
