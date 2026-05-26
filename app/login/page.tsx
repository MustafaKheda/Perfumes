import type { Metadata } from "next";
import LoginForm from "./ui/login-form";

export const metadata: Metadata = {
  title: "Sign In | Scentora",
  description: "Sign in to your Scentora account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const params = await searchParams;
  const redirect = Array.isArray(params.redirect)
    ? params.redirect[0]
    : params.redirect;

  return <LoginForm redirectPath={getSafeRedirectPath(redirect)} />;
}

function getSafeRedirectPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }

  return value;
}
