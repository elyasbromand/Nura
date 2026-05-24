"use client";
/**
 * Header
 * App-wide header with navigation, app name, and active alert indicator.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, History, Map, Home, Bell } from "lucide-react";
import { useClusterAlert } from "../../hooks/useClusterAlert.js";

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: Home },
  { label: "History", path: "/history", icon: History },
  { label: "Outbreak", path: "/outbreak", icon: Map },
];

export function Header() {
  const pathname = usePathname();
  const { alertCount } = useClusterAlert();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-500 rounded-lg">
            <Activity size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Nura</span>
          <span className="text-xs text-slate-400 font-normal hidden sm:inline">
            · WHO Protocol
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path;
            const isOutbreak = path === "/outbreak";
            return (
              <Link
                key={path}
                href={path}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
                {isOutbreak && alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {alertCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
