import Logo from "@/components/Logo";
import { twMerge } from "tailwind-merge";

interface BrandProps {
  className?: string;
  variation?: "desktop" | "mobile";
}

export default function Brand({
  className = "",
  variation = "desktop",
}: BrandProps) {
  const isMobile = variation === "mobile";

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      <span
        className={`${isMobile ? "text-3xl" : "text-5xl"} font-bold font-mono ${isMobile ? "bg-yapli-teal bg-clip-text text-transparent" : "text-yapli-teal"} ${isMobile ? "" : "pb-2 mr-3"}`}
      >
        yapli
      </span>
      <Logo size={32} className="mt-2" />
    </div>
  );
}

