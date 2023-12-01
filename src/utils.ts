import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function slugify(str: string, slugChar: string = "_") {
  const slugCharReg = new RegExp(`[\w${slugChar}]+`, "g");
  return str.replace(/\s+/g, "_").replace(slugCharReg, "").toLowerCase();
}

export const cn = (...input: ClassValue[]) => twMerge(clsx(...input));

export const echo = (value: Record<string, unknown> | Array<unknown>) => {
  return JSON.stringify(value, null, 4);
};
