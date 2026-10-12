import { cn } from "@/lib/utils";
import Link from "next/link";

type LinkOverlayProps = {
  href: string;
  children?: React.ReactNode;
  className?: string;
};
export const LinkOverlay = ({
  href,
  children,
  className,
}: LinkOverlayProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "absolute top-0 left-0 w-full h-full link-overlay -z-0 hover:bg-muted/80 transition-colors duration-300",
        className
      )}
    >
      {children}
    </Link>
  );
};
