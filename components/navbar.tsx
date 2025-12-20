"use client";

import ThemeSelector from "@/app/ThemeSelector";
import { Config } from "@/types/config";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Users } from "lucide-react";

interface NavbarProps {
  config: Config;
}

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "People", href: "/people", icon: Users },
];

const Navbar = ({ config }: NavbarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/60 dark:border-white/10 bg-background/80 backdrop-blur-md">
        <div className="relative mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={config.org.logo_url}
              alt={config.org.name}
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-semibold text-lg">
              {config.org.name}
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border bg-background/90 backdrop-blur shadow-sm px-2 py-1">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    px-4 py-1.5 text-sm font-medium rounded-full transition-all
                    ${
                      active
                        ? "bg-[#96D9C0] dark:bg-[#06402B] text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <ThemeSelector />
        </div>
      </header>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 rounded-full border border-zinc-200 dark:border-white/10 bg-background/90 backdrop-blur-xl shadow-xl px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center justify-center
                  px-3 py-2 rounded-full transition-all
                  ${
                    active
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
