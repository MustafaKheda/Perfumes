import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin-auth";
import AdminDashboard from "./ui/admin-dashboard";

export const metadata = {
  title: "Admin Dashboard | Scentora",
};

export default async function AdminPage() {
  const admin = await requireAdminUser();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminDashboard admin={admin} />;
}
