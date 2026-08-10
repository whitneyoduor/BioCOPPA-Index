import type { WeightedIndicator } from '../../calc/calculations';
import { DOMAINS } from '../../data/domains';
import type { DomainId } from '../../data/types';
import { weightColor } from './common';

function HeatmapLegend() {
  return (
    <div className="heatmap-legend">
      <span>Low</span>
      <div className="heatmap-legend__bar">
        {[1, 7, 13, 19, 25].map((v) => (
          <span key={v} style={{ background: weightColor(v) }} />
        ))}
      </div>
      <span>High</span>
      <span className="heatmap-legend__scale">
        Weighted score <em>(Importance × Performance)</em>
      </span>
    </div>
  );
}

export function Heatmap({
  indicators,
  onSelect,
}: {
  indicators: WeightedIndicator[];
  onSelect?: (code: string) => void;
}) {
  const byDomain = (id: DomainId) =>
    indicators.filter((i) => i.domain === id).sort((a, b) => a.code.localeCompare(b.code));

  const rows = DOMAINS.map((d) => ({ domain: d, items: byDomain(d.id) }));
  const maxCount = Math.max(...rows.map((r) => r.items.length), 1);

  return (
    <div>
      <div className="heatmap" style={{ gridTemplateColumns: `180px repeat(${maxCount}, 1fr)` }}>
        <div className="heatmap__corner" />
        {Array.from({ length: maxCount }).map((_, c) => (
          <div key={c} className="heatmap__colhead">
            {c + 1}
          </div>
        ))}

        {rows.map(({ domain, items }) => (
          <>
            <div key={domain.id} className="heatmap__rowhead">
              <span className="dot" style={{ background: domain.color }} />
              <span>
                <strong>{domain.shortLabel}</strong>
                <em>{domain.label}</em>
              </span>
            </div>
            {Array.from({ length: maxCount }).map((_, c) => {
              const ind = items[c];
              if (!ind) return <div key={c} className="heatmap__cell heatmap__cell--empty" />;
              const clickable = onSelect ? 'heatmap__cell--clickable' : '';
              return (
                <button
                  key={ind.id}
                  className={`heatmap__cell ${clickable}`}
                  style={{ '--cell-bg': weightColor(ind.weightedScore) } as React.CSSProperties}
                  title={`${ind.code} · ${ind.name}\nImportance ${ind.importance} × Performance ${ind.performance} = ${ind.weightedScore}`}
                  onClick={onSelect ? () => onSelect(ind.code) : undefined}
                >
                  <strong>{ind.code}</strong>
                  <span>{ind.weightedScore}</span>
                </button>
              );
            })}
          </>
        ))}
      </div>
      <HeatmapLegend />
    </div>
  );
}
