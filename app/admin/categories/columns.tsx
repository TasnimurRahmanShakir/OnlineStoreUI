"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/lib/types";
import { CategoryActions } from "./_components/category-actions";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "parentName",
    header: "Parent Category",
    cell: ({ row }) => {
      const parentName = row.original.parentName;
      return parentName ? (
        <Badge variant="secondary">{parentName}</Badge>
      ) : (
        <span className="text-muted-foreground text-sm">Top Level</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CategoryActions category={row.original} otherCategories={[]} />;
    },
  },
];
