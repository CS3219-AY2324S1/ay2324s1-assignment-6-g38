"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";

import { selectAuthData } from "@/features/auth";

import LoginButton from "./LoginButton";
import UserDropDownMenu from "./UserDropDownMenu";

export const Navbar = () => {
  const auth = useSelector(selectAuthData);
  const router = useRouter();

  const redirectToHomeOrLanding = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-row justify-between">
      <Button
        className="text-center text-lg font-black"
        variant="ghost"
        onClick={redirectToHomeOrLanding}
      >
        PeerPrep
      </Button>
      <div className="flex gap-10">
        <div>{auth.isLoggedIn ? <UserDropDownMenu /> : <LoginButton />}</div>
      </div>
    </div>
  );
};
