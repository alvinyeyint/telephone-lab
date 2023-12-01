import { cn } from "@/utils";
import Link, { LinkProps } from "next/link";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from "react";

const buttonClassName = [
	"inline-flex items-center justify-center rounded-lg bg-blue-700 p-2.5 text-center text-sm font-medium text-white",
	"hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 active:translate-y-0.5",
];

type ButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

export function Button(props: ButtonProps) {
	return (
		<button
			{...props}
			type={props.type || "button"}
			className={cn(buttonClassName, props.className)}
		/>
	);
}

export function LinkButton(
	props: PropsWithChildren<LinkProps & { className?: string }>,
) {
	return <Link {...props} className={cn(buttonClassName, props.className)} />;
}
