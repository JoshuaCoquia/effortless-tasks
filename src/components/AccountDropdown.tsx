import Image from "next/image";
import accountCircleIcon from "@/images/account_circle_24dp_090B0D_FILL0_wght400_GRAD0_opsz24.svg";
import type { Session } from "next-auth";

type AccountDropdownProps = {
    session: Session;
};

export default function AccountDropdown({ session }: AccountDropdownProps) {

    return (
        <div className="group flex flex-col items-end">
            <a href="#" className="flex outline-0 h-12 border-2 border-grey-dark rounded-lg justify-center items-center pl-3 pr-2">
                <span>{session.user.email}</span>
                <Image src={accountCircleIcon} width={24} height={24} alt="Account Icon" className="ml-2 pointer-events-none" />
            </a>
            <a href="/api/auth/signout" className="hidden group-hover:block group-focus-within:block ml-4 text-sm" aria-label={`Log out`}>
                Log out
            </a>
        </div>
    );
}