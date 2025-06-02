"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        window.location.href = "/dashboard";
      } else {
        // If auto sign-in fails, redirect to sign-in page
        window.location.href = "/auth/signin";
      }
    } catch (error: unknown) {
      setError(
        (error as Error)?.message || "An error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text mb-2">
              Registration Successful!
            </h2>
            <p className="text-text opacity-70 mb-4">
              Your account has been created. Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            Create Account
          </h2>
          <p className="text-text opacity-70 text-center mb-6">
            Sign up to start managing your chatrooms
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text mb-1"
              >
                Name (optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

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
                placeholder="Enter your password (min. 6 characters)"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-card text-text focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden w-full px-4 py-2 bg-gradient-to-r from-[#3EBDC7] to-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yapli-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#7bcad9] before:to-blue-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
            >
              <span className="relative z-10">
                {isLoading ? "Creating account..." : "Create Account"}
              </span>
            </button>
          </form>

          <p className="text-xs text-text opacity-50 text-center mt-6">
            By creating an account, you agree to our terms of service and
            privacy policy.
          </p>

          <div className="text-center mt-4">
            <p className="text-sm text-text opacity-70">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-yapli-teal hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Logo />
    </div>
  );
}

