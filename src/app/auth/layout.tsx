import { ReactNode } from "react";
import Brand from "@/components/Brand";
import ThemeToggle from "@/components/ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Brand />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto mt-16 px-4">
        {children}
      </main>
    </div>
  );
}