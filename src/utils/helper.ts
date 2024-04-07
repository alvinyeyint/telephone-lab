import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export const cn = (...input: ClassValue[]) => twMerge(clsx(...input));

export function slugify(str: string, slugChar: string = "_") {
	const slugCharReg = new RegExp(`[w${slugChar}]+`, "g");
	return str.replace(/\s+/g, "_").replace(slugCharReg, "").toLowerCase();
}
