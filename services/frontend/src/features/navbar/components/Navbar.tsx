"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

import { selectAuthData } from "@/features/auth";

import LoginButton from "./LoginButton";
import ModeToggle from "./ThemeToggle";
import UserDropDownMenu from "./UserDropDownMenu";

export const Navbar = () => {
  const auth = useSelector(selectAuthData);
  return (
    <div className="flex flex-row justify-between border-b border-gray-200 bg-card px-8 py-4  dark:border-gray-800">
      <div className="flex gap-1">
        <Image src="/logo.svg" alt="PeerPrep" width={25} height={25} />
        <Link
          className="flex items-center text-center text-lg font-black"
          href="/"
        >
          PeerPrep
        </Link>
      </div>
      <div className="flex gap-10">
        <ModeToggle />
        <div>{auth.isLoggedIn ? <UserDropDownMenu /> : <LoginButton />}</div>
      </div>
    </div>
  );
};
