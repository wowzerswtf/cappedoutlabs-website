import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/apply", label: "Apply" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Left */}
          <div className="max-w-sm">
            <Link href="/" className="text-lg font-bold tracking-tight text-navy">
              Capped Out Labs
            </Link>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              AI revenue infrastructure for operators who are serious about
              growth — and serious about exit.
            </p>
            <p className="mt-2 text-xs text-text-secondary/60">
              A Capped Out Media company
            </p>
          </div>

          {/* Center */}
          <div className="flex gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-navy transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="max-w-xs">
            <p className="text-sm text-text-secondary leading-relaxed">
              Limited spots per quarter.
            </p>
            <Link
              href="/apply"
              className="inline-block mt-3 text-sm font-semibold text-electric hover:text-electric-dark transition-colors"
            >
              Apply for a discovery call &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-secondary/50">
            &copy; {new Date().getFullYear()} Capped Out Labs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/apply"
              className="text-xs text-text-secondary/50 hover:text-text-secondary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/apply"
              className="text-xs text-text-secondary/50 hover:text-text-secondary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
