"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Check if we're in system mode
  const isSystemMode = theme === "system" || !theme;
  const currentlyShowing = resolvedTheme; // "light" or "dark"
  
  // Show the opposite of what's currently displayed
  const showLightIcon = currentlyShowing === "dark";
  
  const handleClick = () => {
    if (isSystemMode) {
      // Switch to opposite of what system is showing
      setTheme(currentlyShowing === "dark" ? "light" : "dark");
    } else {
      // Toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  const getTooltipText = () => {
    const targetTheme = currentlyShowing === "dark" ? "light" : "dark";
    return `Switch to ${targetTheme} mode`;
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
      title={getTooltipText()}
    >
      {showLightIcon ? (
        <SunIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
}