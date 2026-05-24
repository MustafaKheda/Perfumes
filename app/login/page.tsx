import type { Metadata } from "next";
import LoginForm from "./ui/login-form";

export const metadata: Metadata = {
  title: "Sign In | Scentora",
  description: "Sign in to your Scentora account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
