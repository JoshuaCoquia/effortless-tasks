// https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=language&language=ts
import type { Metadata } from 'next'
import { login } from './actions'

export const metadata: Metadata = {
  title: 'Login - Effortless Tasks',
  description: 'Login to Effortless Tasks to manage your to-do lists.',
  openGraph: {
    title: 'Login - Effortless Tasks',
    type: 'website',
    url: 'https://effortless-tasks.vercel.app/login'
  }
}

export default function LoginPage() {
  return (
    <>
      <section className="flex flex-col items-center justify-center">
        <h1 className="mt-8 text-center font-bold text-md">Login</h1>
        <form className="my-4 mx-4 items-center flex flex-col gap-4 w-full max-w-prose">
          <label className="font-bold w-full">Email<span className="text-red-dark">*</span>
            <input id="email" name="email" type="email" required autoFocus className="w-full bg-grey-light-background border-0 rounded-lg my-0.5 px-2 py-1.5 font-normal" />
          </label>
          <label className="font-bold w-full">Password<span className="text-red-dark">*</span>
            <input id="password" name="password" type="password" required className="w-full bg-grey-light-background border-0 rounded-lg my-0.5 px-2 py-1.5 font-normal" />
          </label>
          <br />
          <button formAction={login} className="w-full border-2 border-black p-2 outline-0 rounded-lg cursor-pointer hover:bg-grey-light-background focus:bg-grey-light-background transition-colors duration-150">Log in</button>
        </form>
        <p>Need an account? <a href="/signup" className="underline">Sign up now!</a></p>
      </section>

    </>
  )
}