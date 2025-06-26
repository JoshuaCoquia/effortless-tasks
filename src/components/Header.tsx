import loginIcon from "@/images/login_24dp_090B0D_FILL0_wght400_GRAD0_opsz24.svg";
import Image from "next/image";

export default function Header() {
    return (
        <header className="flex items-end p-4">
            <a href="/login" className="w-12 h-12 border-2 rounded-lg border-grey-dark flex-none outline-0 hover:bg-grey-light-background focus:bg-grey-light-background transition-colors duration-150 flex justify-center" aria-label={`Open sign in modal`}>
                <Image src={loginIcon} width={24} height={24} alt="Login Icon" className="pointer-events-none" />
            </a>
        </header>
    )
}