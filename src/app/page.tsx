"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import PrimaryButton from "@/components/PrimaryButton";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      const response = await fetch("/api/rooms/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomUrl: roomCode.trim() }),
      });

      const data = await response.json();

      if (data.exists) {
        router.push(`/${data.roomUrl}`);
      } else {
        setError("Room not found. Please check your code.");
      }
    } catch {
      setError("Failed to check room. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isChecking) {
      handleJoinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Theme toggle in top-right corner */}
      <div className="absolute top-4 right-4 z-10 hidden lg:block">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 pt-8 pb-16  lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
          {/* Left side - Welcome text */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-text flex flex-wrap items-center justify-center lg:justify-start gap-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#3EBDC7] to-[#064E64] bg-clip-text text-transparent">
                Yapli
              </span>
              <Logo size={40} className="mt-2" />
            </h1>
            <p className="text-lg lg:text-2xl text-muted-text mb-8 leading-relaxed">
              Create instant chat rooms and connect with anyone, anywhere. Share
              a link and start conversations in seconds.
            </p>
            <div className="space-y-4 lg:text-lg text-base text-muted-text text-center lg:text-left">
              <div className="flex items-center lg:flex-row flex-col">
                <span className="mr-3">✨</span>
                No signup required for chatroom participants
              </div>
              <div className="flex items-center lg:flex-row flex-col">
                <span className="mr-3">🚀</span>
                Instant room creation with modern UI
              </div>
              <div className="flex items-center lg:flex-row flex-col">
                <span className="mr-3">🔗</span>
                Frictionless sharing with a simple link or code
              </div>
            </div>
          </div>

          {/* Right side - CTA */}
          <div className="lg:w-1/2 flex flex-col items-center text-center">
            <div className="space-y-6">
              <Card>
                <h2 className="text-2xl font-semibold mb-6 text-center text-text">
                  Trying to join a room?
                </h2>
                <p className="text-center text-muted-text mb-6">
                  Enter the six character code here
                </p>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="abcdef"
                    maxLength={6}
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toLowerCase())}
                    onKeyPress={handleKeyPress}
                    disabled={isChecking}
                    className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-border rounded-lg bg-background text-text placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-[#3EBDC7] focus:border-transparent disabled:opacity-50"
                  />
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                  <PrimaryButton
                    onClick={handleJoinRoom}
                    disabled={isChecking}
                    className="px-6 py-3"
                  >
                    {isChecking ? "Checking..." : "Join Room"}
                  </PrimaryButton>
                </div>
              </Card>

              <Card>
                <h2 className="text-2xl font-semibold mb-6 text-center text-text">
                  Want to create chat rooms?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signin">
                    <PrimaryButton className="px-8 py-3">
                      Login
                    </PrimaryButton>
                  </Link>
                  <Link href="/auth/register">
                    <PrimaryButton variant="outline" className="px-8 py-3">
                      Sign Up
                    </PrimaryButton>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
