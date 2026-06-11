import type { Metadata } from "next";
import { AuthSplit } from "@/components/auth-split";

export const metadata: Metadata = { title: "Create account — Zanzo" };

export default function SignupPage() {
  return <AuthSplit initialMode="signup" />;
}
