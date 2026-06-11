import type { Metadata } from "next";
import { AuthSplit } from "@/components/auth-split";

export const metadata: Metadata = { title: "Sign in — Zanzo" };

export default function LoginPage() {
  return <AuthSplit initialMode="login" />;
}
