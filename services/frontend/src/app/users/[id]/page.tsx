"use client";

import { BookMarked, Link, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { selectAuthData } from "@/features/auth";
import { HistoryTable } from "@/features/home/components/HistoryTable";
import { EditUserProfileForm } from "@/features/users";

import { useGetHistoryQuery } from "@/services/historyApi";
import { useGetUserByIdQuery } from "@/services/userApi";

const page = ({ params }: { params: { id: number } }) => {
  const auth = useSelector(selectAuthData);
  const { data: user, isLoading, isError } = useGetUserByIdQuery(params.id);
  const {
    data: history,
    isLoading: isGetHistoryLoading,
    isError: isGetHistoryError,
  } = useGetHistoryQuery({ userId: params.id });

  if (isError) {
    throw new Error("User not found");
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  const handleClickHistoryRow = () => {
    // nav to session
  };

  return (
    <div className="flex gap-x-8">
      <Card className="h-2/5 max-w-[350px]">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              {user?.name}
            </h1>
            {auth.currentUser && auth.currentUser.email === user!.email ? (
              <EditUserProfileForm userId={params.id} />
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-3 text-sm">
            <div>
              <Link href="#/" />
            </div>
            <p className="break-all">
              {user?.url || "User has yet to provide a url"}
            </p>
          </div>

          <div className="flex gap-3 text-sm">
            <div>
              <BookMarked />
            </div>
            <p className="break-all">
              {user?.bio || "User has yet to provide a bio"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grow">
        <h2 className="text-4xl font-bold tracking-tight">History</h2>
        <p className="mb-4 text-muted-foreground">
          A list of all the questions that you have solved.
        </p>
        {isGetHistoryLoading && (
          <div className="flex justify-center">
            <Loader2 className="mr-2 animate-spin" />
          </div>
        )}

        <HistoryTable histories={history || []} />
      </div>
    </div>
  );
};

export default page;
