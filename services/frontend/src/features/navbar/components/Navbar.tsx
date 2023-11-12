"use client";

import Link from "next/link";
import React from "react";

export const Navbar = () => {
  return (
    <div className="flex flex-row justify-between">
      <Link className="text-center text-lg font-black" href="/">
        PeerPrep
      </Link>
      <div className="flex gap-10" />
    </div>
  );
};
