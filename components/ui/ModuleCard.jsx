"use client";
/**
 * ModuleCard
 * Clickable card on the dashboard for selecting an assessment module.
 * Shows module title, subtitle, SDG target, and WHO protocol reference.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ModuleCard({ title, subtitle, sdgTarget, whoProtocol, path, colorScheme, icon: Icon, stats }) {
  const colors = {
    blue: {
      border: "border-blue-100",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
      arrow: "text-blue-400 group-hover:text-blue-600",
    },
    rose: {
      border: "border-rose-100",
      bg: "bg-rose-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      badge: "bg-rose-100 text-rose-700",
      arrow: "text-rose-400 group-hover:text-rose-600",
    },
    teal: {
      border: "border-teal-100",
      bg: "bg-teal-50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      badge: "bg-teal-100 text-teal-700",
      arrow: "text-teal-400 group-hover:text-teal-600",
    },
  };

  const c = colors[colorScheme] ?? colors.teal;

  return (
    <Link href={path} className="group block">
      <div
        className={`relative rounded-2xl border-2 ${c.border} ${c.bg} p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-98`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${c.iconBg}`}>
            {Icon && <Icon size={22} className={c.iconColor} />}
          </div>
          <ArrowRight size={18} className={`mt-1 transition-transform group-hover:translate-x-1 ${c.arrow}`} />
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-4">{subtitle}</p>

        <div className="flex flex-wrap gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
            {sdgTarget}
          </span>
        </div>

        {stats && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
            <div>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
            {stats.urgent > 0 && (
              <div>
                <p className="text-xl font-bold text-red-600">{stats.urgent}</p>
                <p className="text-xs text-slate-400">Urgent</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
