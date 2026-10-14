import { cn } from "@/lib/utils";
import Link from "next/link";

type LinkBoxProps = {
  children: React.ReactNode;
  className?: string;
};
export const LinkBox = ({ children, className }: LinkBoxProps) => {
  return (
    <div className={cn("relative group link-box", className)}>{children}</div>
  );
};
