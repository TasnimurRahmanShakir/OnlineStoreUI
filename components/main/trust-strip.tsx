"use client";

import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over $50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure payment",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated support",
  },
  {
    icon: CreditCard,
    title: "Money Back",
    description: "30 day guarantee",
  },
];

export function TrustStrip() {
  return (
    <div className="bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 justify-center sm:justify-start"
            >
              <div className="p-3 bg-white rounded-full shadow-sm text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
