import type { CSSProperties, ReactNode } from 'react';
import type { DomainId } from '../data/types';
import { DOMAIN_BY_ID } from '../data/domains';

/* ---------------------------------- Card ---------------------------------- */

export function Card({
  title,
  subtitle,
  actions,
  children,
  className = '',
  style,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section className={`card ${className}`} style={style}>
      {(title || actions) && (
        <header className="card__header">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

/* ---------------------------------- Badge --------------------------------- */

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export function toneForScore(score: number): BadgeTone {
  if (score >= 4) return 'success';
  if (score >= 3) return 'warning';
  return 'danger';
}

export function toneForPercentage(pct: number): BadgeTone {
  if (pct >= 75) return 'success';
  if (pct >= 50) return 'warning';
  return 'danger';
}

/* ------------------------------- ProgressBar ------------------------------ */

export function ProgressBar({
  value,
  max = 25,
  color,
  height = 8,
}: {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="progress" style={{ height }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress__fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

/* -------------------------------- ScoreRing ------------------------------- */

export function ScoreRing({
  value,
  max = 10,
  size = 120,
  stroke = 10,
  color,
  label,
  suffix,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: ReactNode;
  suffix?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color ?? 'var(--primary)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="ring__label">
        <span className="ring__value">
          {value}
          {suffix && <small className="ring__suffix">{suffix}</small>}
        </span>
        {label && <span className="ring__caption">{label}</span>}
      </div>
    </div>
  );
}

/* --------------------------------- StatCard ------------------------------- */

export function StatCard({
  label,
  value,
  sub,
  color,
  icon,
  trend,
  footer,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  color: string;
  icon?: ReactNode;
  trend?: { label: string; direction: 'up' | 'down' | 'flat' };
  footer?: ReactNode;
}) {
  return (
    <div className="stat-card" style={{ '--stat-color': color } as CSSProperties}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {icon && <span className="stat-card__icon">{icon}</span>}
      </div>
      <div className="stat-card__value">{value}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
      {trend && (
        <div className={`stat-card__trend stat-card__trend--${trend.direction}`}>
          {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '•'} {trend.label}
        </div>
      )}
      {footer}
    </div>
  );
}

/* -------------------------------- PageHeader ------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}

/* -------------------------------- DomainDot ------------------------------- */

export function DomainDot({ domainId }: { domainId: DomainId }) {
  return <span className="dot" style={{ background: DOMAIN_BY_ID[domainId].color }} />;
}

export function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="legend-item">
      <span className="dot" style={{ background: color }} />
      {label}
    </span>
  );
}

/* --------------------------------- EmptyState ------------------------------ */

export function EmptyState({ message }: { message: string }) {
  return <div className="empty-state">{message}</div>;
}
