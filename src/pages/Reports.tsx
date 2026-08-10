import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { generateRecommendations, scoreToPercentage } from '../calc/calculations';
import { BarChart } from '../components/charts/BarChart';
import { DoughnutChart } from '../components/charts/DoughnutChart';
import { Badge, Card, PageHeader, toneForPercentage } from '../components/ui';
import { DownloadIcon, StarIcon, TrendingDownIcon } from '../components/icons';
import { DOMAIN_BY_ID } from '../data/domains';

export function Reports() {
  const { activeDataset, index, ready } = useData();

  const recommendations = useMemo(() => (index ? generateRecommendations(index) : []), [index]);

  if (!ready) return <div className="loading">Loading datasets…</div>;
  if (!activeDataset || !index) return <div className="empty-state">No dataset loaded.</div>;

  const exportExcel = () => {
    const rows = index.domains.flatMap((d) =>
      d.indicators.map((i) => [i.code, i.name, d.domain.label, i.section, i.importance, i.performance, i.weightedScore]),
    );
    const header = ['Code', 'Indicator', 'Domain', 'Section', 'Importance', 'Performance', 'Weighted Score'];
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioCOPPA-${activeDataset.meta.country}-${activeDataset.meta.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => window.print();

  const rank = [...index.domains.flatMap((d) => d.indicators)].sort((a, b) => b.weightedScore - a.weightedScore);

  const domainData = index.domains.map((d) => ({
    label: d.domain.shortLabel,
    value: d.score,
    color: d.domain.color,
  }));

  return (
    <div className="page report">
      <PageHeader
        title="BioCOPPA Index Report"
        subtitle={`Auto-generated from the ${activeDataset.meta.country} ${activeDataset.meta.year} dataset · ${activeDataset.meta.source}`}
        actions={
          <div className="btn-row">
            <button className="btn btn--primary" onClick={exportPdf}>
              <DownloadIcon width={16} height={16} /> Export to PDF
            </button>
            <button className="btn btn--ghost" onClick={exportExcel}>
              <DownloadIcon width={16} height={16} /> Export to Excel
            </button>
          </div>
        }
      />

      <div className="report__meta">
        <div>
          <span>Country</span>
          <strong>{activeDataset.meta.country}</strong>
        </div>
        <div>
          <span>Assessment year</span>
          <strong>{activeDataset.meta.year}</strong>
        </div>
        <div>
          <span>Overall index</span>
          <strong>{index.indexOutOf10.toFixed(1)} / 10</strong>
        </div>
        <div>
          <span>Readiness</span>
          <strong>
            <Badge tone={toneForPercentage(index.percentage)}>{index.readinessLevel}</Badge>
          </strong>
        </div>
        <div>
          <span>Indicators</span>
          <strong>{index.domains.reduce((s, d) => s + d.indicators.length, 0)}</strong>
        </div>
      </div>

      <Card title="Executive summary" subtitle="Automatically generated narrative">
        <p className="report__summary">
          {activeDataset.meta.country} achieves an overall BioCOPPA Index of{' '}
          <strong>{index.overallScore.toFixed(2)} / 5</strong> — equivalent to{' '}
          <strong>{index.indexOutOf10.toFixed(1)} out of 10</strong> and{' '}
          <strong>{index.percentage}% readiness</strong> for biological crop protection products ({index.readinessLevel}).
          The strongest domain is <strong>{index.topDomain.domain.label}</strong> ({index.topDomain.score.toFixed(2)}/5),
          while <strong>{index.bottomDomain.domain.label}</strong> ({index.bottomDomain.score.toFixed(2)}/5) is the main
          constraint. {index.strongestIndicators[0].code} (“{index.strongestIndicators[0].name}”) is the strongest
          indicator and {index.weakestIndicators[0].code} (“{index.weakestIndicators[0].name}”) the weakest, pointing to
          clear priorities for investment and reform.
        </p>
      </Card>

      <div className="grid grid--2">
        <Card title="Domain performance" subtitle="Scores and weighted contributions">
          <BarChart data={domainData} min={1} max={5} height={220} valueFormatter={(v) => v.toFixed(2)} />
          <div className="table-wrap">
            <table className="table table--compact">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th className="align-right">Score / 5</th>
                  <th className="align-right">Readiness</th>
                  <th className="align-right">Weighted sum</th>
                </tr>
              </thead>
              <tbody>
                {[...index.domains].sort((a, b) => b.score - a.score).map((d) => (
                  <tr key={d.domainId}>
                    <td>
                      <span className="cell-domain" style={{ color: d.domain.color }}>
                        {d.domain.label}
                      </span>
                    </td>
                    <td className="align-right">{d.score.toFixed(2)}</td>
                    <td className="align-right">{scoreToPercentage(d.score)}%</td>
                    <td className="align-right">{d.weightedScoreSum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Overall readiness" subtitle="Normalised score">
          <div className="chart-vertical">
            <DoughnutChart percentage={index.percentage} indexOutOf10={index.indexOutOf10} size={180} stroke={18} />
            <p className="report__center-text">
              {activeDataset.meta.country} ranks at the <strong>{index.readinessLevel}</strong> tier of readiness.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid--2">
        <Card title="Top indicators" subtitle="Ranked by weighted score">
          <RankTable rows={rank.slice(0, 5)} tone="up" />
        </Card>
        <Card title="Priority indicators" subtitle="Lowest weighted scores — focus areas">
          <RankTable rows={rank.slice(-5).reverse()} tone="down" />
        </Card>
      </div>

      <Card title="Recommendations" subtitle="Generated from the weakest indicators and domain gaps">
        <ul className="recommendations">
          {recommendations.map((r) => (
            <li key={r.id}>
              <span className="recommendations__icon">
                {r.priority === 'high' ? <TrendingDownIcon width={16} height={16} /> : <StarIcon width={16} height={16} />}
              </span>
              <div className="recommendations__body">
                <strong>
                  <span className="cell-domain" style={{ color: DOMAIN_BY_ID[r.domainId].color }}>
                    {DOMAIN_BY_ID[r.domainId].shortLabel}
                  </span>
                  {r.title}
                </strong>
                <p>{r.detail}</p>
              </div>
              <Badge tone={r.priority === 'high' ? 'danger' : 'warning'}>{r.priority}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function RankTable({ rows, tone }: { rows: Array<{ code: string; name: string; weightedScore: number; domain: string }>; tone: 'up' | 'down' }) {
  return (
    <div className="table-wrap">
      <table className="table table--compact">
        <thead>
          <tr>
            <th>Indicator</th>
            <th className="align-right">Score / 25</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((i) => (
            <tr key={i.code}>
              <td>
                <span className={`rank-bullet rank-bullet--${tone}`} />
                <span className="cell-name">
                  {i.code} · {i.name}
                </span>
              </td>
              <td className="align-right">
                <strong>{i.weightedScore}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
