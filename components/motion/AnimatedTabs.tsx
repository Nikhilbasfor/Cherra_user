"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TabOption {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  layoutId?: string;
  className?: string;
  variant?: "light" | "glass" | "green";
}

export function AnimatedTabs({
  tabs,
  activeId,
  onChange,
  layoutId = "activeTabPill",
  className = "",
  variant = "glass",
}: AnimatedTabsProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1 rounded-2xl ${
        variant === "glass"
          ? "bg-black/35 backdrop-blur-md border border-white/20 shadow-inner"
          : variant === "green"
          ? "bg-emerald-950/40 backdrop-blur-md border border-emerald-400/20"
          : "bg-white/90 backdrop-blur-sm border border-slate-200"
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 shrink-0 select-none flex items-center gap-1.5 ${
              isActive
                ? variant === "glass" || variant === "green"
                  ? "text-emerald-950"
                  : "text-white"
                : variant === "glass" || variant === "green"
                ? "text-white/80 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                  mass: 0.8,
                }}
                className={`absolute inset-0 rounded-xl shadow-sm ${
                  variant === "glass" || variant === "green"
                    ? "bg-white"
                    : "bg-emerald-600"
                }`}
                style={{ zIndex: 0 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
