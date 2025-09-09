"use client";

import { useFormStatus } from "react-dom";

import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";

export function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className="relative"
      disabled={pending}
    >
      {children}
      {pending && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit form"}
      </span>
    </Button>
  );
}
