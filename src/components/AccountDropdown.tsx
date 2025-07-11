import Image from "next/image";
import accountCircleIcon from "@/images/account_circle_24dp_090B0D_FILL0_wght400_GRAD0_opsz24.svg";
import logOutIcon from "@/images/logout_24dp_090B0D_FILL0_wght400_GRAD0_opsz24.svg";
import { UserResponse } from "@supabase/supabase-js";

type AccountDropdownProps = {
    user: UserResponse["data"]["user"];
};

export default function AccountDropdown({ user }: AccountDropdownProps) {
    return (
        <div className="group flex flex-col items-end gap-2">
            <a href="#" className="flex outline-0 h-12 border-2 border-grey-dark rounded-lg justify-center items-center pl-3 pr-2 hover:bg-grey-light-background focus:bg-grey-light-background transition-colors duration-150" aria-label={`Open account dropdown`}>
                <span>{user!.email}</span>
                <Image src={accountCircleIcon} width={24} height={24} alt="Account Icon" className="ml-2 pointer-events-none" />
            </a>
            <form action="/auth/signout" method="post">
                <button className="hidden group-focus-within:flex outline-0 h-12 border-2 border-grey-dark rounded-lg p-2 hover:bg-grey-light-background focus:bg-grey-light-background transition-colors duration-150" type="submit">
                    <Image src={logOutIcon} width={24} height={24} alt="Account Icon" className="pointer-events-none mr-1" />
                    Sign Out
                </button>
            </form>
        </div>
    );
}