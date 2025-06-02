import Image from "next/image";

export default function Logo() {
  return (
    <div className="fixed bottom-4 right-4 z-10 opacity-60 hover:opacity-100 transition-opacity">
      <Image
        src="/images/yapli-logo.png"
        alt="Yapli Logo"
        width={48}
        height={48}
        className="rounded-lg"
      />
    </div>
  );
}
