import Logo from "./Logo";

export default function LogoMark() {
  return (
    <div className="fixed bottom-4 right-4 z-10 opacity-60 hover:opacity-100 transition-opacity">
      <Logo size={48} className="rounded-lg" animate={true} />
    </div>
  );
}
