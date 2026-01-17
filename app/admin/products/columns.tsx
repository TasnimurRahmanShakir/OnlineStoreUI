"use client";

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
import { BASE_URL2 } from "@/lib/api-client";

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
              src={BASE_URL2 + baseImage}
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
    accessorKey: "priceSummary",
    header: "Price",
  },
  {
    accessorKey: "totalStock",
    header: "Stock",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`} className="w-full">
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
