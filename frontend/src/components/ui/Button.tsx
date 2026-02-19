import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={clsx("rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50", className)}
    {...props}
  />
);
