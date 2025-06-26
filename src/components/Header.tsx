import loginIcon from "@/images/login_24dp_090B0D_FILL0_wght400_GRAD0_opsz24.svg";
import accountCircleIcon from "@/images/account_circle_24dp_090B0D_FILL0_wght400_GRAD0_opsz24.svg";
import Image from "next/image";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();
  return (
    <header className="flex justify-end items-end p-4">
      {session?.user ? (
        <button className="flex outline-0 h-12 border-2 border-grey-dark rounded-lg justify-center items-center pl-3 pr-2">
          <span>{session.user.email}</span>
          <Image src={accountCircleIcon} width={24} height={24} alt="Account Icon" className="ml-2 pointer-events-none" />
          {/* dropdown menu for account settings, sign out, etc. */}
        </button>
      ) : (
        <a href="/login" className="w-12 h-12 border-2 rounded-lg border-grey-dark flex-none outline-0 hover:bg-grey-light-background focus:bg-grey-light-background transition-colors duration-150 flex justify-center" aria-label={`Open sign in modal`}>
          <Image src={loginIcon} width={24} height={24} alt="Login Icon" className="pointer-events-none" />
        </a>
      )}
    </header >
  )
}