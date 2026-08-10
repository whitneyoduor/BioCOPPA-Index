import { useMeasuredWidth } from './common';

export interface RadarPoint {
  label: string;
  value: number;
}

const MIN = 1;
const MAX = 5;
const LABEL_OFFSET = 46;

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export function RadarChart({
  series,
  benchmark,
  height = 300,
}: {
  /** Active dataset values per axis. */
  series: RadarPoint[];
  /** Optional benchmark values (e.g. peer average). */
  benchmark?: RadarPoint[];
  height?: number;
}) {
  const [ref, width] = useMeasuredWidth<HTMLDivElement>();
  const w = width || 320;
  const cx = w / 2;
  const cy = height / 2 + 6;
  const maxR = Math.min(w, height) / 2 - LABEL_OFFSET;
  const n = Math.max(series.length, 1);
  const angle = (i: number) => -90 + i * (360 / n);

  const radius = (value: number) => (Math.min(MAX, Math.max(MIN, value)) - MIN) / (MAX - MIN) * maxR;
  const point = (i: number, value: number) => polar(cx, cy, radius(value), angle(i));
  const labelPos = (i: number) => polar(cx, cy, maxR + 22, angle(i));
  const ringRadius = (value: number) => radius(value);

  const polygon = (pts: RadarPoint[]) => pts.map((p, i) => point(i, p.value).join(',')).join(' ');

  const rings = [1, 2, 3, 4, 5];

  return (
    <div ref={ref} className="chart">
      <svg width={w} height={height}>
        {rings.map((r) => {
          const rr = ringRadius(r);
          const pts = series.map((_, i) => polar(cx, cy, rr, angle(i)));
          return (
            <polygon
              key={r}
              points={pts.map((p) => p.join(',')).join(' ')}
              fill="none"
              stroke="var(--chart-grid)"
              strokeDasharray={r === MAX ? undefined : '3 4'}
            />
          );
        })}

        {series.map((_, i) => {
          const [x, y] = polar(cx, cy, maxR, angle(i));
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--chart-grid)" />;
        })}

        {benchmark && benchmark.length === series.length && (
          <polygon
            points={polygon(benchmark)}
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth={1.75}
            strokeDasharray="5 4"
            opacity={0.85}
          />
        )}

        <polygon points={polygon(series)} fill="var(--primary)" fillOpacity={0.22} stroke="var(--primary)" strokeWidth={2.5} strokeLinejoin="round" />

        {series.map((s, i) => {
          const [x, y] = point(i, s.value);
          return <circle key={s.label} cx={x} cy={y} r={4} fill="var(--primary)" stroke="var(--surface)" strokeWidth={2} />;
        })}

        {series.map((s, i) => {
          const [x, y] = labelPos(i);
          return (
            <text key={s.label} x={x} y={y} textAnchor="middle" className="chart-axis-label chart-axis-label--strong">
              {s.label}
              <tspan x={x} dy={14} className="chart-value-label">
                {s.value.toFixed(2)}
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
}
