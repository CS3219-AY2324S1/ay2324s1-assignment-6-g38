"use client";

import { signIn, useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import type * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { register } from "@/features/auth/state/authSlice";

import { useCreateUserMutation } from "@/services/userApi";

import { CreateUserSchema } from "../types/onboarding.schema";

import { useApiNotifications } from "@/hooks/useApiNotifications";

export const OnboardingForm = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [createUser, { isLoading, isError, isSuccess }] =
    useCreateUserMutation();

  useApiNotifications({
    isSuccess,
    isError,
    successMessage: "Successfully updated user profile!",
  });

  if (!session) {
    <div>Loading</div>;
  }

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: session?.user?.name!,
      email: session?.user?.email!,
      url: "",
      bio: "",
    },
    mode: "all",
  });

  React.useEffect(() => {
    if (session) {
      form.reset({
        name: session.user?.name ?? "",
        email: session.user?.email ?? "",
        url: "",
        bio: "",
      });
    }
  }, [session, form]);

  async function onSubmit(values: z.infer<typeof CreateUserSchema>) {
    createUser({
      ...values,
      bio: values.bio === "" ? null : values.bio,
      url: values.url === "" ? null : values.url,
    })
      .unwrap()
      .then((res) => {
        dispatch(register(res));
        signIn("github", { callbackUrl: `/` });
      })
      .catch(() => {
        throw new Error("Unable to register user!");
      });
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  This is your public display name.
                </FormDescription>
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full gap-5">
            <Button
              isLoading={isLoading}
              loadingText="Submitting"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
