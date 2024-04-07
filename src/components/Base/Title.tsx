import { cn } from "@src/utils/helper";
import { PropsWithChildren } from "react";

export function Title({
  size = "lg",
  className,
  children,
}: PropsWithChildren<{ size?: "sm" | "md" | "lg"; className?: string }>) {
  if (size === "sm")
    return <h6 className={cn("text-sm font-bold", className)}>{children}</h6>;
  if (size === "md")
    return <h4 className={cn("text-lg font-bold", className)}>{children}</h4>;
  else
    return <h2 className={cn("text-2xl font-bold", className)}>{children}</h2>;
}
