import type { Metadata } from "next";
import SignupForm from "./ui/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | Scentora",
  description: "Create your Scentora customer account.",
};

export default function SignupPage() {
  return <SignupForm />;
}
