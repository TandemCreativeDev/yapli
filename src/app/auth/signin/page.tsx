"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";

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

            <FormInput
              type="email"
              id="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />

            <FormInput
              type="password"
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            <PrimaryButton
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </PrimaryButton>
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
  );
}
