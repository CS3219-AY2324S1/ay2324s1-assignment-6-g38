import { Archive, LogOut, UserSquare2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { selectAuthData, signOut } from "@/features/auth";

const UserDropDownMenu = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuthData);
  const { data: session } = useSession();

  const handleSignOut = () => {
    dispatch(signOut());
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          {auth.image && <AvatarImage src={auth.image} />}
          <AvatarFallback>{auth?.currentUser?.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {auth.isLoggedIn && auth.currentUser === null && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/onboarding" className="flex items-center gap-2">
              <UserSquare2 size={15} />
              Onboarding
            </Link>
          </DropdownMenuItem>
        )}
        {auth.currentUser !== null && (
          <>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href={`/users/${auth?.currentUser?.id}`}
                className="flex items-center gap-2"
              >
                <UserSquare2 size={15} />
                Your Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/questions" className="flex items-center gap-2">
                <Archive size={15} />
                Questions
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <LogOut size={15} />
            Sign out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDownMenu;
