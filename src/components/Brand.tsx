import Logo from "@/components/Logo";
import { twMerge } from "tailwind-merge";

interface BrandProps {
  className?: string;
}

export default function Brand({ className = "" }: BrandProps) {
  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      <span className="font-bold font-mono text-3xl md:text-5xl text-yapli-teal md:pb-2">
        yapli
      </span>
      <Logo size={32} className="mt-2" />
    </div>
  );
}
