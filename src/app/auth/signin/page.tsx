"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0">
              <h1 className="text-5xl font-bold font-mono bg-gradient-to-r from-[#3EBDC7] to-blue-500 bg-clip-text text-transparent pb-2">
                yapli
              </h1>
              <Image
                src="/images/yapli-logo.png"
                alt="Yapli Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto mt-16 px-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-2xl font-bold text-text mb-2 text-center">
            Sign in to Yapli
          </h2>
          <p className="text-text opacity-70 text-center mb-6">
            Sign in to manage your chatrooms
          </p>

          {/* Email/Password Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#3EBDC7] to-blue-500 hover:from-[#7bcad9] hover:to-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-text opacity-50 text-center mt-6">
            By signing in, you agree to our terms of service and privacy policy.
          </p>

          <div className="text-center mt-4">
            <p className="text-sm text-text opacity-70">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-yapli-teal hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Logo />
    </div>
  );
}

