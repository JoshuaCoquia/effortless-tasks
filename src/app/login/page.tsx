import type { Metadata } from "next";
import { SignIn } from "@/components/SignIn";

export const metadata: Metadata = {
  title: "Login | Effortless Tasks",
  description: "A minimal to-do list app.",
  openGraph: {
    title: "Login | Effortless Tasks",
    type: "website",
    url: "https://effortless-tasks.vercel.app"
  },
};

export default function LoginPage() {
    return (
        <SignIn />
    );
}