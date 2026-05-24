import type { Metadata } from "next";
import ForgotPasswordForm from "./ui/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | Scentora",
  description: "Recover your Scentora account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
