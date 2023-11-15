"use client";

import React from "react";

import UserTable from "@/features/users/components/UserTable";

import { useGetUsersQuery } from "@/services/userApi";

const page = () => {
  const { data: users, error, isLoading } = useGetUsersQuery();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h2 className="text-4xl font-bold tracking-tight">Users</h2>
      <p className="mb-4 text-muted-foreground">
        A list of all users on the app.
      </p>
      <UserTable users={users!} />
    </div>
  );
};

export default page;
