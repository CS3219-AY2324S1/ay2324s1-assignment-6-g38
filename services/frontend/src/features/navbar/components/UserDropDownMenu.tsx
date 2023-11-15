import { Archive, LogOut, UserCog2, Users2, UserSquare2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { persistor, useAppDispatch } from "@/app/store";

import { logoutAndResetState, selectAuthData } from "@/features/auth";
import { selectMatchState } from "@/features/match/state/matchSelector";

const UserDropDownMenu = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useSelector(selectAuthData);
  const { hasOngoingSession } = useSelector(selectMatchState);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    dispatch(logoutAndResetState());
    await persistor.purge();
    router.push("/");
  };

  const isRegistered = auth.currentUser;
  const isAdmin = auth.currentUser?.role === "ADMIN";
  const { isLoggedIn } = auth;

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
        {isLoggedIn && !isRegistered && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/onboarding" className="flex items-center gap-2">
                <UserSquare2 size={15} />
                Onboarding
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {auth.currentUser !== null && (
          <>
            <DropdownMenuSeparator />
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
              <Link
                href={hasOngoingSession ? "/collab" : "/matching"}
                className="flex items-center gap-2"
              >
                <Users2 size={15} />
                Find Match
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {isRegistered && isAdmin && (
          <>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/questions" className="flex items-center gap-2">
                <Archive size={15} />
                Questions
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/admin" className="flex items-center gap-2">
                <UserCog2 size={15} />
                Admin
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
