"use client";

import { useRef, useEffect, useState } from "react";

export interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  tabs: Tab[];
  active: string;
}

export default function TabNav({ tabs, active }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeLink = containerRef.current.querySelector<HTMLAnchorElement>(
      `[data-tab="${active}"]`
    );
    if (activeLink) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicator({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
      });
    }
  }, [active]);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap gap-1" aria-label="Lompat ke bagian">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              data-tab={tab.id}
              aria-current={isActive ? "true" : undefined}
              className={`stateful relative z-10 flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold ${
                isActive
                  ? "text-sky-800 dark:text-sky-300"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <span aria-hidden className="[&>svg]:h-4 [&>svg]:w-4">
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
            </a>
          );
        })}
      </div>
      {/* Indikator aktif bergeser */}
      <div
        aria-hidden
        className="absolute bottom-0 h-0.5 rounded-full bg-sky-700 transition-all duration-300 ease-out dark:bg-sky-400"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}