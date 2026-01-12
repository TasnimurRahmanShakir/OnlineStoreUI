"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Mock Data
const orderDetails = {
  id: "ORD-001",
  customer: { name: "John Doe", email: "john@example.com", address: "123 Main St, New York, NY" },
  items: [
    { name: "Gaming Laptop", quantity: 1, price: 1200 },
    { name: "Mouse", quantity: 2, price: 50 },
  ],
  status: "Pending",
  total: 1300,
};

export default function OrderDetailsPage() {
  const params = useParams();
  const [status, setStatus] = useState(orderDetails.status);

  const handleStatusChange = async (newStatus: string) => {
    // Mock API Call
    console.log(`PATCH /api/orders/${params.id}/status`, { status: newStatus });
    setStatus(newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order {params.id}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="font-semibold">{orderDetails.customer.name}</div>
              <div className="text-sm text-muted-foreground">{orderDetails.customer.email}</div>
              <div className="text-sm text-muted-foreground">{orderDetails.customer.address}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
