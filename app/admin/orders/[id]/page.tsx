import Link from "next/link";
import { getOrderByIdAction } from "@/app/actions/order";
import { OrderProductImage } from "@/components/admin/order-product-image";
import { OrderDetails } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Package,
  User,
  Phone,
} from "lucide-react";
import { OrderActions } from "@/components/admin/order-actions";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getOrderByIdAction(id);

  if (!response.success || !response.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Order Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            {response.error || "Unable to retrieve order details."}
          </p>
          <Button asChild variant="outline">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = response.data;

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-9 w-9" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Order {order.orderNumber}
              </h1>
              <Badge
                variant={
                  order.orderStatus.toLowerCase() === "pending"
                    ? "secondary"
                    : "default"
                }
                className="uppercase text-xs tracking-wide"
              >
                {order.orderStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(order.orderDate)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                <span>
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                  Items
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <OrderActions
            orderId={order.id}
            currentStatus={order.orderStatus}
            canEdit={order.canEdit}
            assignedAdminName={order.assignedAdminName}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-muted/40">
              <CardTitle className="text-lg">Order Items</CardTitle>
              <CardDescription>
                Details of products in this order
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                      {item.image ? (
                        <OrderProductImage
                          src={item.image}
                          alt={item.productName}
                        />
                      ) : (
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="grid gap-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{item.productName}</h3>
                          <p className="font-semibold">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground flex gap-3">
                          {item.color && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-3 h-3 rounded-full border"
                                style={{
                                  backgroundColor: item.color.toLowerCase(),
                                }}
                              ></span>
                              {item.color}
                            </span>
                          )}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-3">
                        <div className="text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                        <div className="font-medium">
                          Subtotal: {formatCurrency(item.subTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/40 p-6">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {formatCurrency(
                      order.totalAmount - (order.shippingFee || 0),
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(order.shippingFee || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/40 pb-4">
              <CardTitle className="text-lg">Customer</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid gap-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="grid gap-1">
                  <p className="font-medium leading-none">
                    {order.customerName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="hover:text-primary transition-colors"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" />
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {order.customerPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Shipping Address</span>
                </div>
                <div className="text-sm text-muted-foreground ml-6 leading-relaxed">
                  {order.shippingAddress}
                  {order.shippingLabel && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-[10px] h-5">
                        {order.shippingLabel}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Payment Information</span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  {order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : `Paid via ${order.paymentMethod}`}
                  <br />
                  <span className="text-xs">
                    Transaction ID: {order.orderNumber}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
