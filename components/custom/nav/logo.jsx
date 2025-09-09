// components/navbar/logo.jsx
"use client";
import Image from "next/image";
import Link from "next/link";

export function Logo({ className }) {
  return (
    <Link href="/" className={`flex items-center ${className || ""}`}>
      <span className="relative h-10 w-10 block">
        <Image
          src="/ShajGhor-logo.png"
          alt="ShajGhor logo"
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </span>
      <span className="text-2xl font-serif italic text-brand">
        ShajGhor
      </span>
    </Link>
  );
}
