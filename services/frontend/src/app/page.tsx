"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // redirect to /matching for assignment 5
    router.replace("/matching");
  }, [router]);

  return (
    <main>
      <p>Home</p>
    </main>
  );
}
