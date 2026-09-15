interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionIntro({ eyebrow, title, description }: Props) {
  return (
    <div>
      <p className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-sky-800 dark:bg-sky-900 dark:text-sky-200">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
        {title}
      </h2>
      <div aria-hidden className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-transparent" />
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
      )}
    </div>
  );
}
