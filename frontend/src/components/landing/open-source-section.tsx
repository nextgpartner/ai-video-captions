"use client";

import { Star, GitFork } from "lucide-react";

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
import { useIntersectionObserver } from "~/hooks/use-intersection-observer";

export function OpenSourceSection() {
  const { ref, isInView } = useIntersectionObserver({ margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative bg-white py-20 dark:bg-black"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="container mx-auto px-6">
        <div
          className={`reveal mx-auto max-w-3xl text-center ${isInView ? "in-view" : ""}`}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 dark:bg-gray-800">
            <GithubIcon className="h-8 w-8 text-white" />
          </div>

          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            100% Open Source
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            No accounts. No data collection. No limits. Self-host with Docker
            Compose in one command. MIT licensed.
          </p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/nicolaigaina/ai-video-captions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#459F94] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#367d74]"
            >
              <Star className="h-4 w-4" />
              Star on GitHub
            </a>
            <a
              href="https://github.com/nicolaigaina/ai-video-captions/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <GitFork className="h-4 w-4" />
              Fork
            </a>
          </div>

          {/* Quick start code block */}
          <div
            className={`reveal mx-auto max-w-md overflow-hidden rounded-2xl bg-gray-900 text-left shadow-lg dark:bg-gray-800 ${isInView ? "in-view" : ""}`}
            style={{ "--stagger": "0.2s" } as React.CSSProperties}
          >
            <div className="flex items-center gap-2 border-b border-gray-700 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-gray-400">terminal</span>
            </div>
            <div className="p-4 font-mono text-sm text-gray-300">
              <p>
                <span className="text-green-400">$</span> git clone
                https://github.com/nicolaigaina/
              </p>
              <p className="pl-4">ai-video-captions.git</p>
              <p className="mt-1">
                <span className="text-green-400">$</span> cd ai-video-captions
              </p>
              <p className="mt-1">
                <span className="text-green-400">$</span> docker compose up
              </p>
              <p className="mt-2 text-gray-500">
                # Open http://localhost:3000
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
