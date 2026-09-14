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
  onChange: (id: string) => void;
}

export default function TabNav({ tabs, active, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-tab="${active}"]`
    );
    if (activeBtn) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [active]);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-1" role="tablist" aria-label="Navigasi halaman">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              data-tab={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`stateful relative z-10 flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "text-sky-800 dark:text-sky-300"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <span aria-hidden className="[&>svg]:h-4 [&>svg]:w-4">
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
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
