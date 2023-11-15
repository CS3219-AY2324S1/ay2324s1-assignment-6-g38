"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { sessionSignIn } from "@/features/auth";

type Props = {
  children?: React.ReactNode;
};

const AuthenticationLayer = ({ children }: Props) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchSessionToken = async () => {
    const response = await fetch("/api/me");
    return response.json();
  };

  useEffect(() => {
    const getUserInfo = async () => {
      if (session) {
        dispatch(
          sessionSignIn({
            currentUser: session.currentUser,
            image: session.user?.image || null,
            sessionToken: await fetchSessionToken(),
            isLoggedIn: true,
          }),
        );
        const isUserRegistered = session.currentUser;

        if (!isUserRegistered) {
          router.push("/onboarding");
        }
      }
    };
    getUserInfo();
  }, [session, dispatch, router]);

  return children;
};

export default AuthenticationLayer;
