"use client";

import { Edit } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import type * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { persistor } from "@/app/store";

import { signOut } from "@/features/auth";
import type { EditUseFormInput } from "@/features/users/types/user.type";

import {
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/services/userApi";

import { UserSchema } from "../types/user.schema";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

import { useApiNotifications } from "@/hooks/useApiNotifications";

export function EditUserProfileForm({ userId }: { userId: number }) {
  const {
    data: user,
    isError: isGetUserError,
    isLoading: isGetUserLoading,
  } = useGetUserByIdQuery(userId);
  const dispatch = useDispatch();
  const [
    updateUser,
    {
      isSuccess: isUpdateSuccess,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
    },
  ] = useUpdateUserMutation();
  const [
    deleteUser,
    {
      isSuccess: isDeleteSuccess,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
    },
  ] = useDeleteUserMutation();

  useApiNotifications({
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    successMessage: "Successfully updated user profile!",
  });

  useApiNotifications({
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    successMessage: "Successfully deleted user!",
  });

  if (isGetUserError) {
    // TODO: Redirect user to error page
    throw new Error("No such User");
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      bio: user?.bio || "",
      url: user?.url || "",
    },
    mode: "onSubmit",
  });

  const {
    formState: { dirtyFields },
  } = form;

  function onSubmit(values: z.infer<typeof UserSchema>) {
    const keys = Object.entries(dirtyFields).reduce(
      (acc, [key, shouldExtract]) => {
        if (
          shouldExtract &&
          values[key as keyof EditUseFormInput] !== undefined
        ) {
          acc[key as keyof EditUseFormInput] =
            values[key as keyof EditUseFormInput];
        }
        return acc;
      },
      {} as EditUseFormInput,
    );
    updateUser({ id: userId, ...keys })
      .unwrap()
      .then(() => {
        setIsOpen(false);
      });
  }

  const deleteUserAccount = () => {
    deleteUser(userId)
      .unwrap()
      .then(() => {
        persistor.purge();
        dispatch(signOut());
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon" className="ml-auto">
          <Edit size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className=" flex text-2xl">Edit Profile</DialogHeader>
        <div className="flex w-full content-center justify-center">
          <div className="w-full">
            <Form {...form}>
              <form
                className="flex flex-col space-y-3"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="This is your public display name."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name. Please avoid putting
                        your real name!
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the email your account is associated with.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={!form.formState.isValid}
                  isLoading={isUpdateLoading}
                  loadingText="Submitting"
                  type="submit"
                  className="w-full"
                >
                  Submit
                </Button>
                <ConfirmDeleteDialog deleteUser={deleteUserAccount} />
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
