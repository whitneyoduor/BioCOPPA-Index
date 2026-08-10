import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { peerDomainAverages, scoreToPercentage } from '../calc/calculations';
import { BarChart } from '../components/charts/BarChart';
import { RadarChart } from '../components/charts/RadarChart';
import { DoughnutChart } from '../components/charts/DoughnutChart';
import { Heatmap } from '../components/charts/Heatmap';
import { Badge, Card, LegendItem, PageHeader, ProgressBar, StatCard, toneForPercentage } from '../components/ui';
import { FlaskIcon, FactoryIcon, ScaleIcon, StarIcon, TrendingDownIcon, TrendingUpIcon, LeafIcon } from '../components/icons';
import { DOMAINS } from '../data/domains';

export function Dashboard() {
  const { activeDataset, datasets, index, ready } = useData();
  const navigate = useNavigate();

  if (!ready) {
    return <div className="loading">Loading datasets…</div>;
  }

  if (!activeDataset || !index) {
    return <div className="empty-state">No dataset loaded. Add one in Settings.</div>;
  }

  const peers = peerDomainAverages(datasets, activeDataset.meta.id);
  const hasPeers = datasets.length > 1;

  const domainData = index.domains.map((d) => ({
    label: d.domain.shortLabel,
    value: d.score,
    color: d.domain.color,
    reference: hasPeers ? peers[d.domainId] : undefined,
  }));

  const radarSeries = index.domains.map((d) => ({ label: d.domain.shortLabel, value: d.score }));
  const radarBenchmark = hasPeers
    ? index.domains.map((d) => ({ label: d.domain.shortLabel, value: peers[d.domainId] }))
    : undefined;

  const domainById = (id: string) => DOMAINS.find((d) => d.id === id);

  return (
    <div className="page">
      <PageHeader
        title={`${activeDataset.meta.country} BioCOPPA Index`}
        subtitle={`${activeDataset.meta.year} assessment · ${index.domains.reduce((s, d) => s + d.indicators.length, 0)} indicators`}
        actions={
          <Badge tone={toneForPercentage(index.percentage)}>
            {index.readinessLevel} readiness
          </Badge>
        }
      />

      {/* Summary cards */}
      <div className="grid grid--4">
        <StatCard
          label="Overall BioCOPPA Index"
          value={`${index.indexOutOf10.toFixed(1)} / 10`}
          sub={`${index.percentage}% readiness`}
          color="var(--primary)"
          icon={<LeafIcon />}
          trend={{ label: `Score ${index.overallScore.toFixed(2)} / 5`, direction: 'flat' }}
        />
        {index.domains.map((d) => (
          <StatCard
            key={d.domainId}
            label={d.domain.label}
            value={`${d.score.toFixed(2)} / 5`}
            sub={`${scoreToPercentage(d.score)}% readiness`}
            color={d.domain.color}
            icon={<DomainIcon domainId={d.domainId} />}
            footer={
              <div className="stat-card__bar">
                <ProgressBar value={d.score} max={5} color={d.domain.color} height={6} />
              </div>
            }
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid--3">
        <Card
          title="Domain comparison"
          subtitle="Scores on a 1–5 scale"
          actions={hasPeers ? <LegendItem color="var(--text-muted)" label="Peer avg." /> : undefined}
          className="grid__span-1"
        >
          <BarChart data={domainData} min={1} max={5} valueFormatter={(v) => v.toFixed(2)} referenceLabel={hasPeers ? 'Peer avg.' : undefined} />
        </Card>

        <Card
          title="Domain profile"
          subtitle="Readiness across the three domains"
          actions={
            <div className="legend-row">
              <LegendItem color="var(--primary)" label={activeDataset.meta.country} />
              {hasPeers && <LegendItem color="var(--text-muted)" label="Peer avg." />}
            </div>
          }
        >
          <RadarChart series={radarSeries} benchmark={radarBenchmark} />
        </Card>

        <Card title="Overall readiness" subtitle="Normalised to 0–100">
          <div className="chart-vertical">
            <DoughnutChart percentage={index.percentage} indexOutOf10={index.indexOutOf10} />
            <ul className="doughnut-legend">
              {index.domains.map((d) => (
                <li key={d.domainId}>
                  <span className="dot" style={{ background: d.domain.color }} />
                  <span>{d.domain.shortLabel}</span>
                  <strong>{scoreToPercentage(d.score)}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Heatmap + insights */}
      <div className="grid grid--insights">
        <Card
          title="Indicator performance heatmap"
          subtitle="Colour = weighted score (Importance × Performance). Click a cell to inspect."
          className="heatmap-card"
        >
          <Heatmap indicators={index.domains.flatMap((d) => d.indicators)} onSelect={(code) => navigate(`/indicators?code=${code}`)} />
        </Card>

        <Card title="Recent insights" subtitle="Automatically derived from the current dataset">
          <div className="insights">
            <InsightRow
              tone="up"
              icon={<TrendingUpIcon width={18} height={18} />}
              title={`Highest scoring domain · ${index.topDomain.domain.shortLabel}`}
              sub={`${index.topDomain.domain.label} at ${index.topDomain.score.toFixed(2)} / 5`}
            />
            <InsightRow
              tone="down"
              icon={<TrendingDownIcon width={18} height={18} />}
              title={`Lowest scoring domain · ${index.bottomDomain.domain.shortLabel}`}
              sub={`${index.bottomDomain.domain.label} at ${index.bottomDomain.score.toFixed(2)} / 5`}
            />
            <div className="insights__group">
              <h4 className="insights__group-title">Strongest indicators</h4>
              {index.strongestIndicators.map((i) => (
                <IndicatorRow key={i.id} code={i.code} name={i.name} score={i.weightedScore} tone="success" icon={<StarIcon width={15} height={15} />} />
              ))}
            </div>
            <div className="insights__group">
              <h4 className="insights__group-title">Weakest indicators</h4>
              {index.weakestIndicators.map((i) => (
                <IndicatorRow key={i.id} code={i.code} name={i.name} score={i.weightedScore} tone="danger" icon={<TrendingDownIcon width={15} height={15} />} />
              ))}
            </div>
            <div className="insights__note">
              {domainById(index.topDomain.domainId)?.label} leads {activeDataset.meta.country}'s readiness; focus on the weakest indicators
              to raise the overall {index.indexOutOf10.toFixed(1)} / 10 index.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DomainIcon({ domainId }: { domainId: string }) {
  if (domainId === 'research') return <FlaskIcon />;
  if (domainId === 'industry') return <FactoryIcon />;
  return <ScaleIcon />;
}

function InsightRow({ tone, icon, title, sub }: { tone: 'up' | 'down'; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className={`insight-row insight-row--${tone}`}>
      <span className="insight-row__icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <span>{sub}</span>
      </div>
    </div>
  );
}

function IndicatorRow({
  code,
  name,
  score,
  tone,
  icon,
}: {
  code: string;
  name: string;
  score: number;
  tone: 'success' | 'danger';
  icon: React.ReactNode;
}) {
  return (
    <div className={`indicator-row indicator-row--${tone}`}>
      <span className="indicator-row__icon">{icon}</span>
      <div className="indicator-row__text">
        <span className="indicator-row__name">
          <b>{code}</b> {name}
        </span>
      </div>
      <strong className="indicator-row__score">{score}</strong>
    </div>
  );
}
