import { PropsWithChildren } from "react";

export function Center({ children }: PropsWithChildren<object>) {
  return (
    <div className="grid h-[100svh] w-full place-items-center">{children}</div>
  );
}
