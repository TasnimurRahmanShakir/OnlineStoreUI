import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllOrdersAction } from "@/app/actions/order";
import { OrderActions } from "@/components/admin/order-actions";
import { AdminSearch } from "@/components/admin/admin-search";
import { getSession } from "@/lib/session";
import { api } from "@/lib/api-client";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;

  const session = await getSession();
  const isSuperAdmin = session?.role === "Super Admin";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = {
    items: [],
    totalPages: 0,
    currentPage: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  if (q) {
    const result = await api.get(`/Search/orders?q=${q}`);
    if (result.success) {
      data = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: (result.data as any).map((i: any) => ({
          id: i.id,
          orderNumber: i.orderNumber,
          date: new Date(), // Search DTO doesn't have date yet, simplistic view
          customerName: i.customerName,
          total: 0, // DTO simplification
          status: i.status || "Pending",
        })),
        totalPages: 1,
        currentPage: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }
  } else {
    const response = await getAllOrdersAction(currentPage, limit);
    if (response.success && response.data) {
      data = response.data;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <AdminSearch placeholder="Search orders..." />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items && data.items.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data.items.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>৳{order.total?.toFixed(2) ?? "0.00"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderActions
                      orderId={order.id}
                      currentStatus={order.status}
                      canEdit={order.canEdit}
                      assignedAdminName={order.assignedAdminName}
                      isSuperAdmin={isSuperAdmin}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {data.currentPage} of {data.totalPages}
        </div>
        <div className="space-x-2">
          {!q && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.hasPreviousPage}
                asChild={data.hasPreviousPage}
              >
                {data.hasPreviousPage ? (
                  <Link href={`/admin/orders?page=${data.currentPage - 1}`}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.hasNextPage}
                asChild={data.hasNextPage}
              >
                {data.hasNextPage ? (
                  <Link href={`/admin/orders?page=${data.currentPage + 1}`}>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
