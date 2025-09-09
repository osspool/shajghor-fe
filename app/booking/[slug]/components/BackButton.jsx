"use client"
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ className = "" }) {
  const router = useRouter();
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => router.back()}
      aria-label="Go back"
      className={`h-9 px-3  ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-1.5" />
      Back
    </Button>
  );
}


