"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // redirect to /questions for assignment 1
    router.replace("/questions");
  }, [router]);

  return (
    <main>
      <p>Home</p>
    </main>
  );
}
