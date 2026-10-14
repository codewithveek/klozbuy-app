import React from "react";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const AppLogo = ({
  className,
  size = "md",
  showText = true,
}: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Link
      href="/"
      className={cn(
        "flex gap-1 font-bold text-klozui-dark-800",

        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-center justify-center ">
        <div className="relative">
          <MapPin
            size={iconSizes[size]}
            className="text-klozui-green-600"
            strokeWidth={3}
            fill="#34C759"
            color="white"
          />
          <div className="absolute top-[-2px] left-[50%] transform translate-x-[-50%] w-[60%] h-[3px] bg-white rounded-t-full" />
          <div className="absolute bottom-[3px] left-[50%] transform translate-x-[-50%] w-[30%] h-[30%] bg-klozui-amber-500 rounded-full animate-ping-slow" />
        </div>
        {showText && (
          <span className="flex items-center">
            <span className="text-klozui-green-600">Kloz</span>
            <span className="text-klozui-amber-800">buy</span>
          </span>
        )}
      </div>
    </Link>
  );
};

export default AppLogo;
