import type { DailyPoint } from "@koda/analytics";

interface Props {
  points: DailyPoint[];
  metric: "pageViews" | "sessions" | "orders";
  label: string;
}

const W = 720;
const H = 240;
const PAD = { top: 12, right: 8, bottom: 28, left: 36 };

const fmtDay = (day: string) => `${day.slice(8, 10)}/${day.slice(5, 7)}`;

/** Histogramme journalier en SVG inline : léger, accessible (table équivalente en sr-only), sans librairie. */
export function DailyBars({ points, metric, label }: Props) {
  const max = Math.max(1, ...points.map((p) => p[metric]));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / Math.max(1, points.length);
  const barW = Math.max(2, slot * 0.62);
  const ticks = [0, 0.5, 1].map((r) => Math.round(max * r));
  const labelEvery = Math.ceil(points.length / 10);
  const total = points.reduce((a, p) => a + p[metric], 0);

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${label} : ${total} sur ${points.length} jours`}
        className="h-auto w-full"
      >
        {ticks.map((t) => {
          const y = PAD.top + innerH - (t / max) * innerH;
          return (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="rgba(20,20,20,.08)" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="12" fill="#6b6661">
                {t}
              </text>
            </g>
          );
        })}
        {points.map((p, i) => {
          const h = (p[metric] / max) * innerH;
          const x = PAD.left + i * slot + (slot - barW) / 2;
          return (
            <g key={p.day}>
              <rect x={x} y={PAD.top + innerH - h} width={barW} height={h} rx={Math.min(4, barW / 2)} fill="#141414">
                <title>{`${fmtDay(p.day)} : ${p[metric]}`}</title>
              </rect>
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#6b6661">
                  {fmtDay(p.day)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>{label} par jour</caption>
        <thead>
          <tr>
            <th scope="col">Jour</th>
            <th scope="col">{label}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.day}>
              <td>{p.day}</td>
              <td>{p[metric]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
