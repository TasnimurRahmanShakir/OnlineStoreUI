"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  updateOrderStatusAction,
  deleteOrderAction,
} from "@/app/actions/order";
import { toast } from "sonner";

import { Lock } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  canEdit?: boolean;
  assignedAdminName?: string;
  isSuperAdmin?: boolean;
}

export function OrderActions({
  orderId,
  currentStatus,
  canEdit = true, // Default to true if not provided (backward compatibility)
  assignedAdminName,
  isSuperAdmin = false,
}: OrderActionsProps) {
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const statuses = [
    { label: "Pending", value: "Pending", icon: Clock },
    { label: "Processing", value: "Processing", icon: Package },
    { label: "Shipped", value: "Shipped", icon: Truck },
    { label: "Delivered", value: "Delivered", icon: CheckCircle },
    { label: "Cancelled", value: "Cancelled", icon: XCircle },
  ];

  const handleStatusChange = async (newStatus: string) => {
    console.log("handleStatusChange called", { orderId, newStatus });
    if (loading) return;
    setLoading(true);
    try {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        toast.success("Order status updated successfully");
      } else {
        toast.error(`Failed to update status: ${result.error}`);
      }
    } catch {
      toast.error("An error occurred while updating status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log("handleDelete called", { orderId });
    if (loading) return;
    setLoading(true);
    try {
      const result = await deleteOrderAction(orderId);
      if (result.success) {
        toast.success("Order deleted successfully");
      } else {
        toast.error(`Failed to delete order: ${result.error}`);
      }
    } catch {
      toast.error("An error occurred while deleting order");
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            {canEdit || isSuperAdmin ? (
              <MoreHorizontal className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
            {!canEdit && !isSuperAdmin && assignedAdminName && (
              <span className="block text-xs font-normal text-muted-foreground mt-1">
                Locked by {assignedAdminName}
              </span>
            )}
            {!canEdit && !isSuperAdmin && !assignedAdminName && (
              <span className="block text-xs font-normal text-muted-foreground mt-1">
                Locked (Cancelled or Restricted)
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/orders/${orderId}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={!canEdit}>
              <Package className="mr-2 h-4 w-4" />
              Change Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={currentStatus}
                onValueChange={handleStatusChange}
              >
                {statuses.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                    disabled={
                      status.value === "Cancelled" &&
                      currentStatus === "Cancelled"
                    }
                  >
                    <status.icon className="mr-2 h-4 w-4" />
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setDeleteOpen(true)}
            disabled={!canEdit && !isSuperAdmin} // Assuming if strictly locked, also can't delete here. Or backend handles it.
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order and remove it from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
