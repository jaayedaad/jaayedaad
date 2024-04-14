"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  // create loading state
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-full flex justify-center items-center flex-col">
      <h2 className="text-3xl">Houston, We have a problem!</h2>
      <div className="flex gap-4 mt-8">
        <Button onClick={() => router.refresh()}>Try again</Button>
        <Button asChild>
          <Link href="/dashboard">
            Back to dashboard <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
