"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/verify", icon: ShieldCheck, label: "Verification" },
];

export default function Sidebar() {
    const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r bg-card p-4 lg:flex">
      <div className="flex h-16 items-center gap-2 px-2">
        <Logo className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold tracking-tight text-foreground">VerityLock</span>
      </div>

      <nav className="mt-4 flex-1 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.label}
            asChild
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start text-base"
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="mt-auto p-2">
        <Button variant="ghost" className="w-full justify-start text-base">
          <Settings className="h-5 w-5" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
