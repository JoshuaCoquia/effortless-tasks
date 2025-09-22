import type { Metadata } from 'next'
import { signup } from './actions'

export const metadata: Metadata = {
  title: 'Sign Up - Effortless Tasks',
  description: 'Sign Up to Effortless Tasks to manage your to-do lists.',
  openGraph: {
    title: 'Sign Up - Effortless Tasks',
    type: 'website',
    url: 'https://effortless-tasks.vercel.app/Sign Up'
  }
}

export default function SignUpPage() {
  return (
    <>
      <section className="flex flex-col items-center justify-center mx-4">
        <h1 className="mt-8 text-center font-bold text-md">Sign Up</h1>
        <form className="my-4 mx-4 items-center flex flex-col gap-4 w-full max-w-prose">
          <label className="font-bold w-full">Email<span className="text-red-dark">*</span>
            <input id="email" name="email" type="email" required autoFocus className="w-full bg-grey-light-background border-0 rounded-lg my-0.5 px-2 py-1.5 font-normal" />
            <small className="text-xs font-normal">
              You will receive a confirmation email to verify your account.
            </small>
          </label>
          <label className="font-bold w-full">Password<span className="text-red-dark">*</span>
            <input id="password" name="password" type="password" required className="w-full bg-grey-light-background border-0 rounded-lg my-0.5 px-2 py-1.5 font-normal" />
          </label>
          <br />
          <button formAction={signup} className="w-full border-2 border-black p-2 outline-0 rounded-lg cursor-pointer hover:bg-grey-light-background focus:bg-grey-light-background transition-colors duration-150">Sign Up</button>
        </form>
        <p>Already have an account? <a href="/login" className="underline">Login here.</a></p>
      </section>
    </>
  )
}