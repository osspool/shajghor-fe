// app/dashboard/documents/error.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-8 py-16 text-center">
      <h2 className="text-2xl font-semibold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8">
        {error.message || "An error occurred while loading the documents."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
