"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AdminSheet } from "./admin-sheet";
import { columns } from "./columns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminPageClient({ initialData }: { initialData: any[] }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admins</h2>
        <Button onClick={() => setIsSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Admin
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <DataTable columns={columns} data={initialData} />
      </div>

      <AdminSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        adminToEdit={null} // Create mode
      />
    </>
  );
}
