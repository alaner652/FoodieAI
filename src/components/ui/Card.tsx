import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", children, ...props },
    ref
  ) => {
    const baseClasses = "rounded-xl";

    const variants = {
      default: "bg-white",
      outlined: "bg-white border border-gray-200",
      elevated: "bg-white shadow-lg",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
