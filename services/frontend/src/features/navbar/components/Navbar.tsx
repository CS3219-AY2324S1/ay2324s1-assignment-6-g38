"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const router = useRouter();

  const redirectToHomeOrLanding = () => {
    router.push("/questions");
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
    </div>
  );
};
