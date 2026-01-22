"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function PromotionalBanner() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Boost your productivity.
            <br />
            Start using our tech today.
          </h2>
          <p className="mt-6 text-lg leading-8 text-primary-foreground/90">
            Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
            Malesuada adipiscing sagittis vel nulla.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="font-semibold"
            >
              <Link href="/store">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-white hover:text-white/80"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
