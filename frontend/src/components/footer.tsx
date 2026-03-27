"use client";

import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";

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

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-gray-900 text-white"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#459F94] to-[#367d74] bg-clip-text text-transparent">
                  AI
                </span>
                <span className="text-white"> Captions</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-gray-400">
              Free, open-source AI video caption generator. Self-hosted,
              private, no limits.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/nicolaigaina/ai-video-captions"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-3 transition-colors hover:bg-[#459F94]"
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="mailto:admin@autoshorts.app"
                className="rounded-full bg-gray-800 p-3 transition-colors hover:bg-[#459F94]"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Generate Captions
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Caption History
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/nicolaigaina/ai-video-captions#quick-start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Self-Host Guide
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nicolaigaina/ai-video-captions/blob/main/docs/API.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Open Source</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/nicolaigaina/ai-video-captions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nicolaigaina/ai-video-captions/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Report a Bug
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/nicolaigaina/ai-video-captions/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Contributing Guide
                </a>
              </li>
              <li>
                <span className="rounded-full border border-gray-700 px-2 py-0.5 text-xs text-gray-400">
                  MIT License
                </span>
              </li>
            </ul>
          </div>

          {/* Built By */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Built By</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://autoshorts.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-400 transition-colors hover:text-white"
                >
                  AutoShorts
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-sm text-gray-500">
                  AI-powered video repurposing for content creators
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} AI Video Captions. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>
                Made by the team behind{" "}
                <a
                  href="https://autoshorts.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#459F94] hover:underline"
                >
                  AutoShorts
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
