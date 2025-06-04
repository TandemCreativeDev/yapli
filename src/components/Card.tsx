import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-8 shadow-lg ${className}`}>
      {children}
    </div>
  );
}