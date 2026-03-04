import { getAllAdmins } from "@/app/actions/admin";
import { AdminPageClient } from "./client"; // Wrapper for client-side interactions

export default async function AdminsPage() {
  const response = await getAllAdmins();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admins = response.success ? (response.data as any[]) : [];

  return (
    <div className="space-y-6">
      <AdminPageClient initialData={admins} />
    </div>
  );
}
