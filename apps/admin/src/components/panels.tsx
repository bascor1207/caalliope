import type { ReactNode } from "react";

export function Panel({
  title,
  hint,
  children,
  className = "",
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`} aria-label={title}>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 className="text-[19px] font-extrabold tracking-[-0.02em]">{title}</h2>
        {hint && <span className="text-sm text-muted">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

/** Liste « libellé → valeur » avec barre proportionnelle : lisible d'un coup d'œil, accessible (vraie table). */
export function RankTable({
  rows,
  label,
  valueLabel,
  empty,
}: {
  rows: Array<[string, number]>;
  label: string;
  valueLabel: string;
  empty: string;
}) {
  if (rows.length === 0) return <p className="text-[15px] text-muted">{empty}</p>;
  const max = Math.max(1, ...rows.map(([, v]) => v));
  return (
    <table className="w-full text-[15px]">
      <thead className="sr-only">
        <tr>
          <th scope="col">{label}</th>
          <th scope="col">{valueLabel}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([key, value]) => (
          <tr key={key} className="border-t border-line first:border-t-0">
            <td className="py-3 pr-4">
              <span className="block truncate font-medium" title={key}>
                {key}
              </span>
              <span className="mt-1.5 block h-2 rounded-full bg-ink/8">
                <span className="block h-full rounded-full bg-ink" style={{ width: `${(value / max) * 100}%` }} />
              </span>
            </td>
            <td className="w-16 py-3 text-right font-semibold tabular-nums">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Entonnoir : chaque étape avec son taux par rapport à la précédente. */
export function Funnel({ steps }: { steps: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...steps.map((s) => s.value));
  return (
    <ol className="grid gap-4">
      {steps.map((step, i) => {
        const prev = steps[i - 1]?.value ?? 0;
        const rate = i === 0 ? null : prev > 0 ? Math.round((step.value / prev) * 100) : 0;
        return (
          <li key={step.label} className="grid grid-cols-[160px_1fr_auto] items-center gap-4 text-[15px]">
            <span className="font-medium">{step.label}</span>
            <span className="block h-8 overflow-hidden rounded-[10px] bg-ink/6">
              <span
                className="block h-full rounded-[10px] bg-linear-to-r from-sage to-sky"
                style={{ width: `${Math.max(2, (step.value / max) * 100)}%` }}
              />
            </span>
            <span className="w-28 text-right tabular-nums">
              <b className="font-semibold">{step.value}</b>
              {rate !== null && <span className="ml-2 text-sm text-muted">{rate} %</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
