import Logo from "@/components/Logo";
import clsx from "clsx";

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
        className={clsx(
          "font-bold font-mono",
          {
            "text-3xl bg-yapli-teal bg-clip-text text-transparent": isMobile,
            "text-5xl text-yapli-teal pb-2 mr-3": !isMobile,
          }
        )}
      >
        yapli
      </span>
      <Logo size={32} className="mt-2" />
    </div>
  );
}

