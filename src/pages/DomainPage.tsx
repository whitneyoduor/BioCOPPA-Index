import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { scoreToPercentage } from '../calc/calculations';
import type { DomainId } from '../data/types';
import { BarChart } from '../components/charts/BarChart';
import { Card, PageHeader, ScoreRing, Badge, toneForPercentage, ProgressBar, LegendItem } from '../components/ui';
import { IndicatorTable } from '../components/IndicatorTable';
import { ChevronRightIcon } from '../components/icons';

export function DomainPage({ domainId }: { domainId: DomainId }) {
  const { activeDataset, index, ready } = useData();

  if (!ready) return <div className="loading">Loading datasets…</div>;
  if (!activeDataset || !index) return <div className="empty-state">No dataset loaded.</div>;

  const domain = index.domains.find((d) => d.domainId === domainId);
  if (!domain) return <div className="empty-state">Domain not found.</div>;

  const sectionData = domain.sections.map((s) => ({
    label: s.name.replace('R&D ', ''),
    value: s.score,
    color: domain.domain.color,
  }));

  return (
    <div className="page">
      <PageHeader
        title={domain.domain.label}
        subtitle={domain.domain.description}
        actions={
          <Link to="/indicators" className="btn btn--ghost">
            All indicators <ChevronRightIcon width={16} height={16} />
          </Link>
        }
      />

      <div className="grid grid--4">
        <div className="domain-hero" style={{ '--accent': domain.domain.color } as React.CSSProperties}>
          <ScoreRing
            value={domain.score}
            max={5}
            color={domain.domain.color}
            suffix="/5"
            label="Domain score"
          />
          <div className="domain-hero__meta">
            <Badge tone={toneForPercentage(scoreToPercentage(domain.score))}>
              {scoreToPercentage(domain.score)}% readiness
            </Badge>
            <p>
              <strong>{domain.indicators.length}</strong> indicators across{' '}
              <strong>{domain.sections.length}</strong> sections
            </p>
          </div>
        </div>

        <Card title="Sections overview" subtitle="Weighted average performance per section (1–5)">
          <BarChart data={sectionData} min={1} max={5} valueFormatter={(v) => v.toFixed(2)} />
        </Card>

        <Card title="Contribution to overall index" subtitle={`${activeDataset.meta.country} ${activeDataset.meta.year}`}>
          <div className="contribution">
            <div className="contribution__value">{domain.domain.shortLabel}</div>
            <div className="contribution__bar">
              <ProgressBar value={domain.score} max={5} color={domain.domain.color} height={10} />
            </div>
            <div className="contribution__row">
              <span>Domain score</span>
              <strong>{domain.score.toFixed(2)} / 5</strong>
            </div>
            <div className="contribution__row">
              <span>Weighted score sum</span>
              <strong>{domain.weightedScoreSum}</strong>
            </div>
            <div className="contribution__row">
              <span>Share of index</span>
              <strong>{((domain.score / (index.overallScore * 3)) * 100).toFixed(1)}%</strong>
            </div>
            <div className="contribution__row">
              <span>Readiness</span>
              <strong>{scoreToPercentage(domain.score)}%</strong>
            </div>
          </div>
        </Card>
      </div>

      {domain.sections.map((section) => (
        <Card
          key={section.name}
          title={section.name}
          subtitle={section.description}
          actions={
            <div className="section-score">
              <span>Section score</span>
              <strong>{section.score.toFixed(2)} / 5</strong>
              <LegendItem color={domain.domain.color} label={`${scoreToPercentage(section.score)}%`} />
            </div>
          }
        >
          <IndicatorTable indicators={section.indicators} />
        </Card>
      ))}
    </div>
  );
}
