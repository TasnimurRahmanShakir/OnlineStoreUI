import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getAllAdmins } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminSheet } from "./admin-sheet";
import { AdminPageClient } from "./client"; // Wrapper for client-side interactions

export default async function AdminsPage() {
  const response = await getAllAdmins();
  const admins = response.success ? response.data : [];

  return (
    <div className="space-y-6">
      <AdminPageClient initialData={admins} />
    </div>
  );
}
