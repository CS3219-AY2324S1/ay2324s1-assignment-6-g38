"use client";

import React from "react";
import { useDispatch } from "react-redux";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

import { signIn } from "@/features/auth";

const LoginButton = () => {
  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(signIn());
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Login</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className="mb-8 w-1/2 text-2xl">
          Login to PeerPrep
        </AlertDialogHeader>
        <Button onClick={handleSignIn}>
          <Icons.GITHUB className="mr-2 h-4 w-4" />
          Login via Github
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginButton;
