"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
          {/* Left side - Welcome text */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-text">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#3EBDC7] to-blue-500 bg-clip-text text-transparent">
                Yapli
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-text mb-8 leading-relaxed">
              Create instant chat rooms and connect with anyone, anywhere. Share
              a link and start conversations in seconds.
            </p>
            <div className="space-y-4 text-lg text-muted-text">
              <div className="flex items-center">
                <span className="mr-3">✨</span>
                No signup required for chatroom participants
              </div>
              <div className="flex items-center">
                <span className="mr-3">🚀</span>
                Instant room creation with modern UI
              </div>
              <div className="flex items-center">
                <span className="mr-3">🔗</span>
                Frictionless sharing with a simple link
              </div>
            </div>
          </div>

          {/* Right side - Logo and CTA */}
          <div className="lg:w-1/2 flex flex-col items-center text-center">
            <div className="mb-8">
              <Image
                src="/images/yapli-logo.png"
                alt="Yapli Logo"
                width={200}
                height={200}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-[#3EBDC7] to-blue-500 hover:from-[#7bcad9] hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="border-2 border-[#3EBDC7] text-[#3EBDC7] hover:bg-[#3EBDC7] hover:text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
            <p className="text-sm text-muted-text mt-4">
              Start chatting in under 10 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

