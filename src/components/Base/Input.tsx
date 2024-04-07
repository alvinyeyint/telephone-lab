import { slugify } from "@src/utils/helper";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useMemo,
} from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
  error?: string;
  leftAddOn?: ReactNode;
  rightAddOn?: ReactNode;

  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, leftAddOn, rightAddOn, leftSlot, rightSlot, ...inputProps },
    ref,
  ) => {
    const labelSlug = useMemo(() => slugify(label), [label]);

    return (
      <div className="w-full">
        <label
          htmlFor={labelSlug}
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          {label}
        </label>

        <div className="flex">
          {leftSlot}

          {leftAddOn && (
            <span className="inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900">
              {leftAddOn}
            </span>
          )}

          <input
            {...inputProps}
            ref={ref}
            id={labelSlug}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />

          {rightAddOn && (
            <span className="inline-flex items-center rounded-e-md border border-s-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900">
              {rightAddOn}
            </span>
          )}

          {rightSlot}
        </div>

        {error && error.length > 0 && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
