"use client";
import AuthModal from "@/components/authentication/AuthModal";
import { useState } from "react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <AuthModal open={isOpen} onOpenChange={setIsOpen} defaultTab="register" />
    </>
  );
}
