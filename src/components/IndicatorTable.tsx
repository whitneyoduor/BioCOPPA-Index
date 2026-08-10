import type { WeightedIndicator } from '../calc/calculations';
import { DOMAIN_BY_ID } from '../data/domains';
import { ProgressBar } from './ui';

export type SortKey = 'code' | 'name' | 'domain' | 'section' | 'importance' | 'performance' | 'weightedScore';
export type SortDir = 'asc' | 'desc';

const LEVEL_TONES = ['danger', 'danger', 'warning', 'warning', 'success'] as const;

export function LevelMeter({ level, max = 5 }: { level: number; max?: number }) {
  const tone = LEVEL_TONES[Math.max(0, Math.min(max - 1, level - 1))];
  return (
    <span className={`level-meter level-meter--${tone}`} title={`Level ${level} / ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < level ? 'level-meter__seg level-meter__seg--on' : 'level-meter__seg'} />
      ))}
      <b>{level}</b>
    </span>
  );
}

export interface IndicatorTableProps {
  indicators: WeightedIndicator[];
  showDomain?: boolean;
  showSection?: boolean;
  sortKey?: SortKey;
  sortDir?: SortDir;
  onSort?: (key: SortKey) => void;
  highlightCode?: string;
}

export function IndicatorTable({
  indicators,
  showDomain = false,
  showSection = false,
  sortKey,
  sortDir,
  onSort,
  highlightCode,
}: IndicatorTableProps) {
  const header = (label: string, key: SortKey, alignRight = false) => {
    const sortable = Boolean(onSort);
    return (
      <th className={alignRight ? 'align-right' : ''}>
        {sortable ? (
          <button
            type="button"
            className={`th-sort ${sortKey === key ? 'th-sort--active' : ''}`}
            onClick={() => onSort?.(key)}
          >
            {label}
            <span className="th-sort__arrows">{sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : '⇅'}</span>
          </button>
        ) : (
          label
        )}
      </th>
    );
  };

  return (
    <div className="table-wrap">
      <table className="table indicator-table">
        <thead>
          <tr>
            {header('Code', 'code')}
            {header('Indicator', 'name')}
            {showDomain && header('Domain', 'domain')}
            {showSection && header('Section', 'section')}
            {header('Importance', 'importance')}
            {header('Performance', 'performance')}
            {header('Weighted Score', 'weightedScore', true)}
          </tr>
        </thead>
        <tbody>
          {indicators.map((i) => (
            <tr key={i.id} className={highlightCode === i.code ? 'row--highlight' : ''} id={`row-${i.code}`}>
              <td>
                <span className="cell-code" style={{ borderColor: DOMAIN_BY_ID[i.domain].color }}>
                  {i.code}
                </span>
              </td>
              <td>
                <div className="cell-name">{i.name}</div>
                <div className="cell-desc">{i.description}</div>
              </td>
              {showDomain && (
                <td>
                  <span className="cell-domain" style={{ color: DOMAIN_BY_ID[i.domain].color }}>
                    {DOMAIN_BY_ID[i.domain].shortLabel}
                  </span>
                </td>
              )}
              {showSection && <td className="cell-section">{i.section}</td>}
              <td>
                <LevelMeter level={i.importance} />
              </td>
              <td>
                <LevelMeter level={i.performance} />
              </td>
              <td className="align-right">
                <div className="cell-weighted">
                  <strong>{i.weightedScore}</strong>
                  <span>/ 25</span>
                </div>
                <div className="cell-bar">
                  <ProgressBar value={i.weightedScore} max={25} color={DOMAIN_BY_ID[i.domain].color} height={5} />
                </div>
              </td>
            </tr>
          ))}
          {indicators.length === 0 && (
            <tr>
              <td colSpan={7} className="empty-state">
                No indicators match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
