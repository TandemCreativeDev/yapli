import Logo from "@/components/Logo";

interface BrandProps {
  className?: string;
}

export default function Brand({ className = "" }: BrandProps) {
  return (
    <div className={`flex items-center gap-0 ${className}`}>
      <h1 className="text-5xl font-bold font-mono text-yapli-teal pb-2 mr-3">
        yapli
      </h1>
      <Logo size={32} className="mt-2" />
    </div>
  );
}