"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Upload, Gamepad2, User, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/feed", label: "Feed", icon: Waves },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/game", label: "Game", icon: Gamepad2 },
  { href: "/profile/me", label: "Profile", icon: User }
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-copper-600/40 bg-background/95 p-3 backdrop-blur md:static md:h-screen md:w-64 md:flex-col md:justify-start md:border-r md:border-t-0 md:px-6 md:py-10">
      <div className="hidden pb-10 text-2xl font-display tracking-[0.2em] md:block">BiteBeat</div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition-all md:flex-row md:gap-3 md:rounded-xl md:px-4 md:text-sm",
              active ? "bg-copper-500/20 text-copper-500 shadow-glow" : "text-foreground/70 hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
