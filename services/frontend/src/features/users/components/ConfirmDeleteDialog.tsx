import React from "react";

import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { DialogClose } from "@radix-ui/react-dialog";

import { AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const ConfirmDeleteDialog = ({
  deleteUser,
}: {
  deleteUser: () => void;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="destructive" className="w-full">
        Delete User
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>Are you absolutely sure?</AlertDialogHeader>
      <AlertDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <DialogClose>
          <AlertDialogAction onClick={deleteUser}>Confirm</AlertDialogAction>
        </DialogClose>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
