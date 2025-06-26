"use client";
import { signIn } from "next-auth/react"
import { useState } from "react";

export function SignIn() {
  const [email, setEmail] = useState(""); 
  const resendAction = () => {
    signIn("resend", {email});
  }

  return (
    <form action={resendAction} className="w-full max-w-sm flex flex-col gap-2">
        <label htmlFor="email-resend" className="font-bold">
          Email
          <input
            type="email"
            id="email-resend"
            name="email"
            autoFocus
            className="w-full text-black placeholder-grey outline-0 transition-all duration-150 bg-grey-light-background border-0 rounded-lg p-1 my-2 font-normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Signin with Resend" className="w-full border-2 rounded-lg p-1 hover:bg-grey-light-background focus:bg-grey-light-background transition-colors duration-150 outline-0" />
      </form>
  );
}