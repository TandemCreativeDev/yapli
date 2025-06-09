import { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "gradient" | "outline";
}

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "gradient",
}: PrimaryButtonProps) {
  const baseClasses =
    "font-bold rounded-lg text-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:ring-offset-2 disabled:opacity-50 disabled:transform-none cursor-pointer";

  const variantClasses =
    variant === "gradient"
      ? "relative overflow-hidden bg-gradient-to-r from-yapli-teal to-yapli-dark text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#7bcad9] before:to-[#064E64] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 py-3 px-8"
      : "border-2 border-yapli-teal text-yapli-teal hover:bg-yapli-teal hover:text-white py-[10px] px-[30px]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(baseClasses, variantClasses, className)}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
