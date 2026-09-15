interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tint: string;
  progress?: number;
}

export default function StatCard({ icon, label, value, sub, tint, progress }: Props) {
  return (
    <div className="stateful group rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-700/70 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <span aria-hidden className={`rounded-xl p-2.5 ${tint}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
          <p className="truncate text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white">{value}</p>
        </div>
      </div>
      {typeof progress === "number" && (
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
          role="img"
          aria-label={`${label} ${Math.round(progress * 100)} persen`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      )}
      {sub && <p className="mt-2 text-xs leading-snug text-zinc-600 dark:text-zinc-400">{sub}</p>}
    </div>
  );
}
