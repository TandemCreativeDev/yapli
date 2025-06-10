import Logo from "@/components/Logo";

export default function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="font-bold font-mono text-3xl md:text-5xl text-yapli-teal md:pb-2">
        yapli
      </span>
      <Logo size={32} className="mt-2" />
    </div>
  );
}
