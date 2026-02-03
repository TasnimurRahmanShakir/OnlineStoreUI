"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteProductAction } from "@/app/actions/product";
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

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/lib/types";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { constructImageUrl } from "@/lib/utils";
// BASE_URL2 import removed

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "baseImage",
    header: "Image",
    cell: ({ row }) => {
      const baseImage = row.getValue("baseImage") as string;
      return (
        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
          {baseImage ? (
            <Image
              src={constructImageUrl(baseImage)}
              alt={row.getValue("name")}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "salePrice",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("salePrice"));
      const formatted = new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
      }).format(price);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "totalStock",
    header: "Stock",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

function CellAction({ data }: { data: Product }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await deleteProductAction(data.id);
      if (result.success) {
        toast.success("Product deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(data.id)}
          >
            Copy product ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/products/${data.id}`} className="w-full">
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
