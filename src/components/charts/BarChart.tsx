import { useMeasuredWidth } from './common';

export interface BarDatum {
  label: string;
  value: number;
  color: string;
  /** Optional benchmark to draw as a marker on the bar. */
  reference?: number;
}

const PAD = { top: 28, right: 12, bottom: 44, left: 36 };

export function BarChart({
  data,
  min = 1,
  max = 5,
  height = 260,
  valueFormatter = (v: number) => v.toFixed(2),
  referenceLabel,
}: {
  data: BarDatum[];
  min?: number;
  max?: number;
  height?: number;
  valueFormatter?: (v: number) => string;
  referenceLabel?: string;
}) {
  const [ref, width] = useMeasuredWidth<HTMLDivElement>();
  const w = width || 300;
  const innerW = w - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const n = data.length;
  const slot = innerW / n;
  const barW = Math.min(56, slot * 0.5);
  const y = (v: number) => PAD.top + innerH - ((v - min) / (max - min)) * innerH;

  const ticks: number[] = [];
  for (let t = min; t <= max; t += 1) ticks.push(t);

  return (
    <div ref={ref} className="chart">
      <svg width={w} height={height}>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={w - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--chart-grid)"
              strokeDasharray={t === min || t === max ? undefined : '3 4'}
            />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="chart-axis-label">
              {t}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = PAD.left + slot * i + slot / 2;
          const barTop = y(d.value);
          const barH = innerH - (barTop - PAD.top) - 0;
          const refY = d.reference !== undefined ? y(d.reference) : null;
          return (
            <g key={d.label}>
              <rect
                x={cx - barW / 2}
                y={barTop}
                width={barW}
                height={barH}
                rx={6}
                fill={d.color}
                fillOpacity={0.9}
              />
              {refY !== null && (
                <>
                  <line x1={cx - barW / 2 - 3} x2={cx + barW / 2 + 3} y1={refY} y2={refY} stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="4 3" />
                  {referenceLabel && i === 0 && (
                    <text x={cx + barW / 2 + 4} y={refY - 4} className="chart-reference-label">
                      {referenceLabel}
                    </text>
                  )}
                </>
              )}
              <text x={cx} y={barTop - 8} textAnchor="middle" className="chart-value-label">
                {valueFormatter(d.value)}
              </text>
              <text x={cx} y={height - PAD.bottom + 20} textAnchor="middle" className="chart-axis-label">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
