import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin-auth";
import AdminLoginForm from "./ui/admin-login-form";

export const metadata = {
  title: "Admin Login | Scentora",
};

export default async function AdminLoginPage() {
  const admin = await requireAdminUser();

  if (admin) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
