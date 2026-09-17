"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const links = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/shows", label: "Shows" },
  { href: "/shorts", label: "Shorts" },
  { href: "/my-list", label: "My List" },
];

export function NavBar() {
  const pathname = usePathname();
  const scrolled = useScrollDirection();
  const onShorts = pathname.startsWith("/shorts");
  const hidden = scrolled || onShorts;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        y: hidden ? -120 : 0,
      }}
      transition={{
        y: { type: "spring", stiffness: 320, damping: 32, mass: 0.6 },
        opacity: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-16"
    >
      <Link
        href="/"
        className="font-display text-xl tracking-tight text-fg transition-opacity duration-300 hover:opacity-80"
      >
        Reel
      </Link>

      <div className="flex items-center gap-1 rounded-full border border-border bg-surface/80 px-1.5 py-1.5 backdrop-blur-md">
        {links.map(({ href, label }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="relative rounded-full px-4 py-1.5 text-sm transition-colors duration-300"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-fg"
                />
              )}
              <span
                className={`relative z-10 ${
                  active ? "text-bg" : "text-muted hover:text-fg"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/search"
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors duration-300 hover:bg-surface hover:text-fg"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </Link>

        <Link
          href="/settings"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors duration-300 hover:bg-surface hover:text-fg"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>
    </motion.nav>
  );
}