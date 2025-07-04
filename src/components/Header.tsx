import loginIcon from "@/images/login_24dp_090B0D_FILL0_wght400_GRAD0_opsz24.svg";
import Image from "next/image";
import { auth } from "@/auth";
import AccountDropdown from "./AccountDropdown";

export default async function Header() {
  const session = await auth();
  return (
    <header className="flex p-4 align-center justify-between flex-col md:flex-row">
      <div className="h-12 flex justify-center align-center">
        <h1 className="text-lg font-bold my-auto hidden md:block">Effortless Tasks</h1>
      </div>
      {session ? (
        <AccountDropdown session={session} />
      ) : (
        <a href="/login" className="w-12 h-12 border-2 rounded-lg border-grey-dark flex-none outline-0 hover:bg-grey-light-background focus:bg-grey-light-background transition-colors duration-150 flex justify-center" aria-label={`Open sign in modal`}>
          <Image src={loginIcon} width={24} height={24} alt="Login Icon" className="pointer-events-none" />
        </a>
      )}
    </header >
  )
}