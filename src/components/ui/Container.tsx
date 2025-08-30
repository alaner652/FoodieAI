import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  center?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = "xl", center = true, children, ...props }, ref) => {
    const maxWidths = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      full: "max-w-full",
    };

    return (
      <div
        ref={ref}
        className={cn(
          maxWidths[maxWidth],
          center && "mx-auto",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;
