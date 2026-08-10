import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { DOMAINS } from '../data/domains';
import type { DomainId } from '../data/types';
import { Card, PageHeader } from '../components/ui';
import { SearchIcon } from '../components/icons';
import { IndicatorTable } from '../components/IndicatorTable';
import type { SortDir, SortKey } from '../components/IndicatorTable';

export function IndicatorAnalysis() {
  const { activeDataset, index, ready } = useData();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('code') ?? '');
  const [domainFilter, setDomainFilter] = useState<DomainId | 'all'>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('weightedScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const highlightCode = searchParams.get('code') ?? undefined;

  const indicators = useMemo(
    () => (index ? index.domains.flatMap((d) => d.indicators) : []),
    [index],
  );

  const sections = useMemo(() => {
    const domain = DOMAINS.find((d) => d.id === domainFilter);
    return domain ? domain.sections.map((s) => s.name) : DOMAINS.flatMap((d) => d.sections.map((s) => s.name));
  }, [domainFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = indicators.filter((i) => {
      if (domainFilter !== 'all' && i.domain !== domainFilter) return false;
      if (sectionFilter !== 'all' && i.section !== sectionFilter) return false;
      if (q && !`${i.code} ${i.name} ${i.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
    return rows;
  }, [indicators, query, domainFilter, sectionFilter, sortKey, sortDir]);

  if (!ready) return <div className="loading">Loading datasets…</div>;
  if (!activeDataset || !index) return <div className="empty-state">No dataset loaded.</div>;

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'weightedScore' || key === 'importance' || key === 'performance' ? 'desc' : 'asc');
    }
  };

  const avgWeighted = filtered.length ? filtered.reduce((s, i) => s + i.weightedScore, 0) / filtered.length : 0;

  return (
    <div className="page">
      <PageHeader
        title="Indicator Analysis"
        subtitle={`${activeDataset.meta.country} ${activeDataset.meta.year} · ${filtered.length} of ${indicators.length} indicators shown`}
      />

      <Card className="filters-card">
        <div className="filters">
          <label className="search-field">
            <SearchIcon width={16} height={16} />
            <input
              type="search"
              placeholder="Search indicator, code or description…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="filter-field">
            <span>Domain</span>
            <select value={domainFilter} onChange={(e) => {
              setDomainFilter(e.target.value as DomainId | 'all');
              setSectionFilter('all');
            }}>
              <option value="all">All domains</option>
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-field">
            <span>Section</span>
            <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
              <option value="all">All sections</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="filters__stats">
            <span>Avg. weighted score</span>
            <strong>{avgWeighted.toFixed(1)}</strong>
          </div>
        </div>
      </Card>

      <Card>
        <IndicatorTable
          indicators={filtered}
          showDomain
          showSection
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={toggleSort}
          highlightCode={highlightCode}
        />
      </Card>
    </div>
  );
}
