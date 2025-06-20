"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";

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
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h1 className="text-2xl font-bold text-text mb-2 text-center">
            Create Account
          </h1>
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

            <FormInput
              type="text"
              id="name"
              label="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />

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
              placeholder="Enter your password (min. 6 characters)"
            />

            <FormInput
              type="password"
              id="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />

            <PrimaryButton
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </PrimaryButton>
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
  );
}
