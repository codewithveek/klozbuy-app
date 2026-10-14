import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  userType?: "individual" | "business";
  className?: string;
  fallbackClassName?: string;
  href?: string;
}

const UserAvatar = ({
  src,
  name,
  size = "md",
  userType = "individual",
  href,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const sizeClass = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 24,
    xl: 32,
  };
  const content = (
    <div className="relative inline-flex">
      <Avatar
        className={cn(
          sizeClass[size],
          "border-2 border-white shadow-sm",
          className
        )}
      >
        <AvatarImage src={src} alt={name} className="object-cover" />
        <AvatarFallback
          className={cn(
            "bg-gradient-to-br",
            userType === "individual"
              ? "from-klozui-green-500/80 to-klozui-green-500"
              : "from-klozui-amber-700/80 to-klozui-amber-700 ",
            "text-black font-medium",
            fallbackClassName
          )}
        >
          {src ? (
            userType === "individual" ? (
              <User size={iconSize[size]} />
            ) : (
              <Store size={iconSize[size]} />
            )
          ) : (
            initials
          )}
        </AvatarFallback>
      </Avatar>
    </div>
  );
  return (
    <>
      {href ? (
        <Link href={href} className="no-underline">
          {content}
        </Link>
      ) : (
        content
      )}
    </>
  );
};

export default UserAvatar;
