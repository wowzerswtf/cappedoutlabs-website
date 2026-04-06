"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "w-full max-w-5xl rounded-2xl border transition-all duration-300 px-5",
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-border shadow-lg shadow-black/5"
            : "bg-white/60 backdrop-blur-md border-white/20 shadow-sm"
        )}
      >
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-navy"
          >
            Capped Out Labs
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all",
                  pathname === link.href
                    ? "text-navy bg-surface"
                    : "text-text-secondary hover:text-navy hover:bg-surface/60"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-3 pl-3 border-l border-border">
              <Button
                asChild
                className="bg-navy hover:bg-navy-light text-white rounded-xl px-5 h-9 text-sm font-semibold"
              >
                <Link href="/apply">Apply Now</Link>
              </Button>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-navy"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="fixed top-20 left-4 right-4 md:hidden bg-white rounded-2xl border border-border shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block text-sm font-medium py-2.5 px-3 rounded-lg transition-colors",
                    pathname === link.href
                      ? "text-navy bg-surface"
                      : "text-text-secondary hover:text-navy hover:bg-surface/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Button
                  asChild
                  className="w-full bg-navy hover:bg-navy-light text-white rounded-xl h-10 text-sm font-semibold"
                >
                  <Link href="/apply">Apply Now</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
