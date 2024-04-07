import { cn } from "@src/utils/helper";
import { PropsWithChildren } from "react";

export function Card({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <article
      className={cn(
        "block rounded-lg border border-gray-200 bg-white p-6 shadow",
        className,
      )}
    >
      {children}
    </article>
  );
}
