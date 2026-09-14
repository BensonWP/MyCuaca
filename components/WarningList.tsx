export default function WarningList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;
  return (
    <section aria-labelledby="peringatan-cuaca" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-700 dark:bg-amber-950">
      <h3 id="peringatan-cuaca" className="text-lg font-bold text-amber-950 dark:text-amber-100">
        Perlu perhatian
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950 dark:text-amber-100">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </section>
  );
}
