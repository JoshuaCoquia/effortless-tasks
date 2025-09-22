import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Check your email!',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckEmailPage() {
  return (
    <>
      <section className="flex flex-col mx-auto w-full max-w-prose">
        <h1 className="mt-8 text-center font-bold text-md">Check your email!</h1>
        <p>You will receive a link to confirm your email address and create your account.</p>
        <p>Don&apos;t see an email? Check your spam folder.</p>
      </section>
    </>
  )
}