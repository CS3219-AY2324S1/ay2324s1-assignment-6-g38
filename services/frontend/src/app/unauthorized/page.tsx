"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const page = () => {
  const router = useRouter();
  const message = useSearchParams().get("message");

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] w-full flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-semibold">Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
      <p>{message}</p>
      <div className=" flex justify-center gap-4">
        <Button onClick={handleBack} variant="secondary" className="min-w-full">
          Back
        </Button>
        <Button onClick={handleHome} className="min-w-full">
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default page;
