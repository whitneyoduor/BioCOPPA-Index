import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Section } from '../components/Page';
import { INDICATORS } from '../data/datasets';
import { DOMAIN_BY_ID } from '../data/domains';
import type { Dataset, Level } from '../data/types';
import { computeIndex, readinessLevelFor, scoreToIndexOutOf10, scoreToPercentage } from '../calc/calculations';

interface Rating {
  importance: Level;
  performance: Level;
}

interface SeedWithRating {
  code: string;
  name: string;
  domain: 'research' | 'industry' | 'policy';
  section: string;
  description: string;
  importance: Level;
}

const IMPORTANCE_LABELS = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
const PERFORMANCE_LABELS = ['Very Weak', 'Low', 'Moderate', 'Strong', 'Very Strong / Mature'];

const SECTION_DISPLAY: Record<string, string> = {
  'Institutional Landscape & Capacity': 'Institutional Landscape & Capacity',
  'Testing & Dissemination': 'Capacities for Testing & Dissemination',
  'R&D Investment & Output': 'R&D Investment & Output',
  'Production & Registration': 'Production & Registration',
  'Distribution & Access': 'Distribution & Access',
  'Market Dynamics': 'Market Dynamics',
  Policy: 'Policy and Regulatory Frameworks',
  'Policy Framework': 'Policy and Regulatory Frameworks',
  'Institutional Support': 'Institutional Support for Registration',
  'Quality Control': 'Quality Assurance and Control',
  Monitoring: 'Post-registration Surveillance',
};

const ROLES = [
  'Regulator',
  'Policy actor',
  'Research / academia',
  'Farmer / farmer organisation',
  'Industry player',
  'NGO / development organisation',
  'Value-chain actor',
];

const seedRating = (seed: SeedWithRating, performance: number): Rating => ({
  importance: seed.importance,
  performance: performance as Level,
});

function ScalePicker({
  value,
  labels,
  onSelect,
  tone,
}: {
  value: number;
  labels: string[];
  onSelect: (v: number) => void;
  tone?: 'gold';
}) {
  return (
    <div className={`scale-picker ${tone === 'gold' ? 'scale-picker--gold' : ''}`} role="radiogroup">
      {labels.map((label, i) => {
        const v = i + 1;
        return (
          <button
            key={v}
            type="button"
            title={`${v} — ${label}`}
            aria-label={`${v} — ${label}`}
            aria-checked={value === v}
            role="radio"
            className={`scale-picker__btn ${value === v ? 'scale-picker__btn--active' : ''}`}
            onClick={() => onSelect(v)}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}

function ScoreRing({ value, size = 168, stroke = 14 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, ((value - 1) / 4) * 100));
  const arc = (pct / 100) * c;
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#efcb16"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="score-ring__label">
        <span className="score-ring__value">{value.toFixed(2)}</span>
        <span className="score-ring__scale">/ 5</span>
        <span className="score-ring__pct">{scoreToPercentage(value).toFixed(1)}%</span>
      </div>
    </div>
  );
}

export function ScoreCalculator() {
  const [country, setCountry] = useState('');
  const [role, setRole] = useState('');
  const [ratings, setRatings] = useState<Record<string, Rating>>(() => {
    const init: Record<string, Rating> = {};
    INDICATORS.forEach((s) => {
      init[s.code] = seedRating(s, 0);
    });
    return init;
  });

  const setRating = (code: string, field: 'importance' | 'performance', value: number) => {
    setRatings((r) => ({ ...r, [code]: { ...r[code], [field]: value as Level } }));
  };

  const loadPreset = (kind: 'kenya' | 'malawi') => {
    setRatings(() => {
      const next: Record<string, Rating> = {};
      INDICATORS.forEach((s) => {
        next[s.code] = seedRating(s, kind === 'kenya' ? s.kenya : s.malawi);
      });
      return next;
    });
  };

  const resetRatings = () => {
    setRatings(() => {
      const next: Record<string, Rating> = {};
      INDICATORS.forEach((s) => {
        next[s.code] = seedRating(s, 0);
      });
      return next;
    });
  };

  const ratedCount = INDICATORS.filter((s) => (ratings[s.code]?.performance ?? 0) > 0).length;
  const totalCount = INDICATORS.length;

  const result = useMemo(() => {
    const rated = INDICATORS.filter((s) => (ratings[s.code]?.performance ?? 0) > 0);
    if (rated.length === 0) return null;
    const dataset: Dataset = {
      meta: {
        id: 'calculator',
        country: country.trim() || 'Unspecified',
        year: 2026,
        source: 'Respondent self-assessment via the BioCOPPA score calculator',
        version: '1.0.0',
        notes: 'Interactive single-respondent assessment. National index scores require structured multi-stakeholder data.',
      },
      indicators: rated.map((s, i) => ({
        id: `calc-${i + 1}`,
        code: s.code,
        name: s.name,
        domain: s.domain,
        section: s.section,
        description: s.description,
        importance: ratings[s.code]?.importance ?? s.importance,
        performance: ratings[s.code]?.performance ?? 0,
      })),
    };
    const index = computeIndex(dataset);
    const activeDomains = index.domains.filter((d) => d.indicators.length > 0);
    const overall = activeDomains.length
      ? activeDomains.reduce((sum, d) => sum + d.score, 0) / activeDomains.length
      : 0;
    const priorities = index.domains
      .flatMap((d) => d.indicators)
      .filter((i) => i.importance >= 4 && i.importance - i.performance >= 1)
      .sort((a, b) => b.importance - a.importance);
    return {
      index,
      overall,
      percentage: scoreToPercentage(overall),
      indexOutOf10: scoreToIndexOutOf10(overall),
      readiness: readinessLevelFor(overall),
      priorities,
    };
  }, [ratings, country]);

  const groupByDomain = (domain: 'research' | 'industry' | 'policy') => {
    const def = DOMAIN_BY_ID[domain];
    const items = INDICATORS.filter((s) => s.domain === domain);
    const sections = Array.from(new Set(items.map((s) => s.section)));
    return { def, items, sections };
  };

  return (
    <>
      <PageHeader
        kicker="Score Calculator"
        title="Calculate a BioCOPPA Score"
        intro="Rate the importance and current performance of each indicator. The calculator combines the two ratings into weighted indicator scores, domain scores and an overall BioCOPPA Index on the standard 1–5 and 0–100 scales."
      />

      <section className="section section--white">
        <div className="container">
          <div className="calculator">
            <aside className="calculator__results">
              <div className="results-card">
                {result ? (
                  <>
                    <div className="results-legend">
                      <span className="dot" style={{ background: DOMAIN_BY_ID.research.color }} /> Research &amp; Development
                      <span className="dot" style={{ background: DOMAIN_BY_ID.industry.color }} /> Industry
                      <span className="dot" style={{ background: DOMAIN_BY_ID.policy.color }} /> Policy &amp; Regulatory
                    </div>
                    <div className="results-card__ring">
                      <ScoreRing value={result.overall} />
                    </div>
                    <p className="results-card__readiness">{result.readiness}</p>

                    <div className="results-card__metrics">
                      <div className="metric">
                        <span className="metric__label">Overall score</span>
                        <span className="metric__value">{result.overall.toFixed(2)} / 5</span>
                      </div>
                      <div className="metric">
                        <span className="metric__label">Normalised</span>
                        <span className="metric__value">{result.percentage.toFixed(1)} / 100</span>
                      </div>
                      <div className="metric">
                        <span className="metric__label">Index</span>
                        <span className="metric__value">{result.indexOutOf10.toFixed(1)} / 10</span>
                      </div>
                    </div>

                    <div className="results-card__domains">
                      {result.index.domains
                        .filter((d) => d.indicators.length > 0)
                        .map((d) => (
                          <div key={d.domainId} className="domain-bar">
                            <div className="domain-bar__top">
                              <span className="domain-bar__label">{DOMAIN_BY_ID[d.domainId].shortLabel}</span>
                              <span className="domain-bar__value">
                                {d.score.toFixed(2)} <small>/ 5</small>
                              </span>
                            </div>
                            <div className="domain-bar__track">
                              <div
                                className="domain-bar__fill"
                                style={{ width: `${((d.score - 1) / 4) * 100}%`, background: DOMAIN_BY_ID[d.domainId].color }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>

                    {result.priorities.length > 0 && (
                      <div className="results-card__priorities">
                        <p className="results-card__subhead">Priority areas (high importance, weak performance)</p>
                        <ul>
                          {result.priorities.map((p) => (
                            <li key={p.code}>
                              <strong>{p.code}</strong> {p.name} — importance {p.importance}/5, performance {p.performance}/5
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="results-card__note">
                      {ratedCount < totalCount
                        ? `Partial result based on ${ratedCount} of ${totalCount} indicators. Rate all indicators for a full score.`
                        : `Result based on all ${totalCount} indicators.`}
                      Single-respondent scores are illustrative; national BioCOPPA scores require the full
                      stakeholder eligibility and balancing procedure.
                    </p>
                  </>
                ) : (
                  <p className="results-card__empty">
                    Rate the performance of at least one indicator to see the calculated BioCOPPA score.
                  </p>
                )}
              </div>

              <div className="results-card results-card--help">
                <p className="results-card__subhead">How scoring works</p>
                <ul className="help-list">
                  <li>Weighted indicator score = Importance × Performance</li>
                  <li>Domain score = Σ(Importance × Performance) ÷ Σ Importance</li>
                  <li>Overall Index = average of the three domain scores</li>
                  <li>0–100 scale = ((score − 1) ÷ 4) × 100</li>
                </ul>
              </div>
            </aside>

            <div className="calculator__form">
              <div className="calculator__panel">
                <h3 className="calculator__panel-title">About the assessment</h3>
                <div className="calculator__respondent">
                  <label className="field">
                    <span className="field__label">Country being assessed (optional)</span>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Kenya, Uganda, Nigeria…"
                    />
                  </label>
                  <label className="field">
                    <span className="field__label">Your stakeholder role</span>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="">Please select…</option>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="calculator__hint">
                  Use the two scales below. <strong>Importance</strong> reflects how important an enabling
                  condition is; <strong>Performance</strong> reflects how well it currently functions in the
                  country being assessed.
                </p>
                <div className="preset-actions">
                  <Link to="/assessment" className="btn btn--outline">
                    Open the full response form instead
                  </Link>
                  <button type="button" className="btn btn--ghost" onClick={loadPreset.bind(null, 'kenya')}>
                    Load Kenya sample
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={loadPreset.bind(null, 'malawi')}>
                    Load Malawi sample
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={resetRatings}>
                    Reset
                  </button>
                </div>
              </div>

              {(['research', 'industry', 'policy'] as const).map((domain) => {
                const { def, sections } = groupByDomain(domain);
                return (
                  <div key={domain} className="calculator__panel">
                    <div className="calculator__domain-head">
                      <span className="dot" style={{ background: def.color }} />
                      <div>
                        <p className="calculator__domain-kicker">Domain · {def.shortLabel}</p>
                        <h3 className="calculator__panel-title">{def.label}</h3>
                      </div>
                    </div>
                    {sections.map((section) => (
                      <div key={section} className="calc-section">
                        <h4 className="calc-section__title">{SECTION_DISPLAY[section] ?? section}</h4>
                        {INDICATORS.filter((s) => s.section === section).map((ind) => (
                          <div key={ind.code} className="indicator-row">
                            <div className="indicator-row__head">
                              <span className="indicator-row__code">{ind.code}</span>
                              <h5 className="indicator-row__name">{ind.name}</h5>
                            </div>
                            <p className="indicator-row__desc">{ind.description}</p>
                            <div className="indicator-row__scales">
                              <div className="indicator-row__scale">
                                <span className="indicator-row__scale-label">Importance</span>
                                <ScalePicker
                                  value={ratings[ind.code]?.importance ?? 1}
                                  labels={IMPORTANCE_LABELS}
                                  onSelect={(v) => setRating(ind.code, 'importance', v)}
                                />
                              </div>
                              <div className="indicator-row__scale">
                                <span className="indicator-row__scale-label">Performance</span>
                                <ScalePicker
                                  value={ratings[ind.code]?.performance ?? 0}
                                  labels={PERFORMANCE_LABELS}
                                  tone="gold"
                                  onSelect={(v) => setRating(ind.code, 'performance', v)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })}

              <div className="calculator__progress">
                <div className="calculator__progress-top">
                  <span>
                    Rated {ratedCount} of {totalCount} indicators
                  </span>
                  <span>{Math.round((ratedCount / totalCount) * 100)}%</span>
                </div>
                <div className="calculator__progress-track">
                  <div className="calculator__progress-fill" style={{ width: `${(ratedCount / totalCount) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section kicker="Methodology" title="What the Scores Mean" className="section--cream">
        <div className="two-col">
          <p>
            A higher BioCOPPA score indicates a stronger and more developed enabling environment for biological
            crop protection products. Domain-level scores retain the diagnostic information needed to identify
            where a country is strongest and where targeted interventions may be most needed.
          </p>
          <p>
            Indicators assessed as <strong>highly important</strong> but with comparatively{' '}
            <strong>weak performance</strong> are flagged as priority areas. The overall index should be
            interpreted together with its underlying domains rather than as a standalone measure.
          </p>
        </div>
      </Section>
    </>
  );
}