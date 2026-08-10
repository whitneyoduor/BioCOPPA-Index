import { lerpColor } from './common';

export function DoughnutChart({
  percentage,
  indexOutOf10,
  size = 210,
  stroke = 22,
  color,
  minColor = '#c99a54',
  maxColor = '#4f8a66',
}: {
  percentage: number;
  indexOutOf10: number;
  size?: number;
  stroke?: number;
  /** Colour override. When omitted, interpolates from minColor to maxColor by percentage. */
  color?: string;
  minColor?: string;
  maxColor?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, percentage));
  const arcColor = color ?? lerpColor(minColor, maxColor, pct / 100);

  return (
    <div className="doughnut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={arcColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="doughnut__label">
        <span className="doughnut__value">{pct.toFixed(0)}%</span>
        <span className="doughnut__caption">Index {indexOutOf10.toFixed(1)} / 10</span>
      </div>
    </div>
  );
}
