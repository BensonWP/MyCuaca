export default function WarningList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;
  return (
    <section aria-labelledby="peringatan-cuaca" className="relative overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm dark:border-amber-700 dark:from-amber-950 dark:to-orange-950">
      <div aria-hidden className="absolute -right-8 -top-8 text-7xl opacity-15">⚠</div>
      <h3 id="peringatan-cuaca" className="flex items-center gap-2 text-base font-extrabold text-amber-950 dark:text-amber-100">
        <span aria-hidden className="rounded-lg bg-amber-400/30 p-1.5">⚠</span>
        Perlu perhatian
      </h3>
      <ul className="mt-2 space-y-1.5 text-sm font-medium text-amber-950 dark:text-amber-100">
        {warnings.map((warning) => (
          <li key={warning} className="flex gap-2">
            <span aria-hidden className="mt-0.5 shrink-0">•</span>
            {warning}
          </li>
        ))}
      </ul>
    </section>
  );
}
