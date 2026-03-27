"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
import { History, Menu, Moon, Sun, X } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const subscribe = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useHasMounted();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200/50 bg-white/80 shadow-md backdrop-blur-lg dark:border-gray-800/50 dark:bg-black/80"
          : "bg-white dark:bg-black"
      }`}
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight sm:text-2xl">
            <span className="bg-gradient-to-r from-[#459F94] to-[#367d74] bg-clip-text text-transparent">
              AI
            </span>
            <span className="text-gray-900 dark:text-white">/</span>
            <span className="bg-gradient-to-r from-[#EDB118] to-[#d9a515] bg-clip-text text-transparent">
              Captions
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-gray-700 transition-colors hover:text-[#459F94] dark:text-gray-300 dark:hover:text-[#459F94]"
          >
            Home
          </Link>
          <Link
            href="/history"
            className="text-gray-700 transition-colors hover:text-[#459F94] dark:text-gray-300 dark:hover:text-[#459F94]"
          >
            History
          </Link>
          <a
            href="https://github.com/nicolaigaina/ai-video-captions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 transition-colors hover:text-[#459F94] dark:text-gray-300 dark:hover:text-[#459F94]"
          >
            GitHub
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* GitHub icon (desktop) */}
          <a
            href="https://github.com/nicolaigaina/ai-video-captions"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden cursor-pointer rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 md:inline-flex dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="GitHub repository"
          >
            <GithubIcon className="h-5 w-5" />
          </a>

          {/* History button (desktop) */}
          <Link
            href="/history"
            className="hidden cursor-pointer items-center gap-1.5 rounded-full bg-[#459F94] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#367d74] md:inline-flex"
          >
            <History className="h-4 w-4" />
            History
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-pointer rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-200 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-gray-700 dark:bg-black/95">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 transition-colors hover:text-[#459F94] dark:text-gray-300"
            >
              Home
            </Link>
            <Link
              href="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 transition-colors hover:text-[#459F94] dark:text-gray-300"
            >
              History
            </Link>
            <a
              href="https://github.com/nicolaigaina/ai-video-captions"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-gray-700 transition-colors hover:text-[#459F94] dark:text-gray-300"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
