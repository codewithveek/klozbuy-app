import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

interface Badge2Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badge2Variants> {
  icon?: React.ElementType;
}
const badge2Variants = cva(
  "flex items-center rounded-full font-medium relative",
  {
    variants: {
      variant: {
        default: "bg-klozui-amber-500/10 text-klozui-amber-900",
        subtle: "bg-klozui-amber-100 text-klozui-gray-dark-900",
        outline:
          "border border-klozui-amber-900 text-klozui-gray-dark-900 bg-transparent",
        filled: "bg-klozui-amber-600/90 text-klozui-gray-dark-900",
      },
      size: {
        default: "text-xs py-0.5 px-1.5 gap-0.5",
        md: "text-sm py-0.5 px-2 gap-1",
        lg: "text-base py-1.5 px-3 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

function Badge2({
  className,
  size,
  variant,

  children,
  ...props
}: Badge2Props) {
  return (
    <div
      className={cn(badge2Variants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge, badge2Variants, Badge2, badgeVariants };
