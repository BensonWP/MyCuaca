"use client";

export function Horizon() {
  return <div aria-hidden className="mt-4 h-px w-full bg-zinc-300 dark:bg-zinc-700" />;
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4" role="status" aria-live="polite" aria-label={label}>
      <div className="h-56 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-28 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-300 bg-red-50 p-5 text-sm text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
    >
      <p className="font-semibold">Data belum bisa dimuat</p>
      <p className="mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 min-h-11 rounded-lg bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="py-2">
      <p className="font-semibold text-zinc-950 dark:text-zinc-100">{title}</p>
      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function RefreshBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-sky-300 bg-sky-50 p-4 text-sm text-sky-950 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-100"
    >
      <p className="font-semibold">Gagal memuat data terbaru</p>
      <p className="mt-1">
        Menampilkan data terakhir yang tersimpan. {message}
      </p>
      <button
        onClick={onRetry}
        className="mt-3 min-h-11 rounded-lg bg-sky-700 px-4 py-2 font-medium text-white hover:bg-sky-800"
      >
        Muat ulang
      </button>
    </div>
  );
}

export function OfflineBanner({ updatedAt }: { updatedAt: Date | null }) {  return (
    <div
      role="status"
      className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
    >
      <p className="font-semibold">Koneksi terputus</p>
      <p className="mt-1">
        {updatedAt
          ? `Menampilkan data terakhir yang dimuat pukul ${updatedAt.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}.`
          : "Belum ada data tersimpan untuk ditampilkan."}
      </p>
    </div>
  );
}
