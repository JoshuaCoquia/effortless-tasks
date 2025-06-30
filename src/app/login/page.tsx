import type { Metadata } from "next";
import { EmailSignIn } from "@/components/EmailSignIn";

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
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Log in with Email</h1>
      <EmailSignIn />
    </main>
  );
}