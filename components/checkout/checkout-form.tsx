"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrderAction } from "@/app/actions/order";
// import { api } from "@/lib/api-client";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  addressLine: z.string().min(5, "Address is required"),
  label: z.enum(["Home", "Office"]),
  isDefault: z.boolean(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  userProfile?: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    addressLine?: string;
    label?: "Home" | "Office";
    isDefault?: boolean;
    addresses?: {
      addressLine: string;
      label: "Home" | "Office";
      isDefault: boolean;
    }[];
  } | null;
}

export function CheckoutForm({
  userProfile,
}: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart, items } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(userProfile);
  // Find default address or first address
  const defaultAddress =
    userProfile?.addresses?.find((addr) => addr.isDefault) || userProfile?.addresses?.[0];

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: userProfile?.fullName || "",
      email: userProfile?.email || "",
      phone: userProfile?.phoneNumber || "",
      addressLine: defaultAddress?.addressLine || "",
      label: defaultAddress?.label || "Home",
      isDefault: defaultAddress?.isDefault ?? false,
    },
  });

  async function onSubmit(data: CheckoutFormValues) {
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        FullName: data.fullName,
        Email: data.email,
        PhoneNumber: data.phone,
        Address: data.addressLine,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      };

      const result = await createOrderAction(orderData);

      if (result.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/");
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Address Line</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a label" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-secondary/20 sm:col-span-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Set as default address</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Use this address for future orders.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={items.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </Form>
  );
}
