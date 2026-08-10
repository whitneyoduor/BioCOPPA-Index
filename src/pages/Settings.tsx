import { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { dataStore } from '../data/dataService';
import type { Dataset, DomainId } from '../data/types';
import { Card, PageHeader } from '../components/ui';
import { InfoIcon, MoonIcon, SunIcon, UploadIcon } from '../components/icons';
const VALID_DOMAINS: DomainId[] = ['research', 'industry', 'policy'];

export function Settings() {
  const { datasets, activeDataset, ready, setActiveDataset } = useData();
  const { theme, toggleTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ ok: boolean; message: string } | null>(null);

  if (!ready) return <div className="loading">Loading datasets…</div>;

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Dataset;
      validateDataset(parsed);
      dataStore.loadDataset(parsed);
      setImportStatus({ ok: true, message: `Imported "${parsed.meta.country} ${parsed.meta.year}" (${parsed.indicators.length} indicators). Dashboard updated automatically.` });
    } catch (err) {
      setImportStatus({ ok: false, message: err instanceof Error ? err.message : 'Could not import file.' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="page">
      <PageHeader title="Settings" subtitle="Manage datasets, appearance and the data layer for the dashboard." />

      <div className="grid grid--2">
        <Card title="Active dataset" subtitle="Controls the data behind every page and chart">
          {activeDataset ? (
            <div className="settings-dataset">
              <div className="settings-dataset__big">
                <strong>{activeDataset.meta.country}</strong>
                <span>{activeDataset.meta.year}</span>
              </div>
              <dl className="settings-dataset__info">
                <div>
                  <dt>Version</dt>
                  <dd>{activeDataset.meta.version}</dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>{activeDataset.meta.source}</dd>
                </div>
                <div>
                  <dt>Indicators</dt>
                  <dd>{activeDataset.indicators.length}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="empty-state">No dataset loaded.</p>
          )}
          <div className="settings-actions">
            <button className="btn btn--ghost" onClick={() => dataStore.reset()}>
              Reset to mock data
            </button>
          </div>
        </Card>

        <Card title="Datasets" subtitle={`${datasets.length} dataset${datasets.length === 1 ? '' : 's'} available`}>
          <div className="settings-datasets">
            {datasets.map((d) => (
              <div key={d.meta.id} className={`settings-dataset-row ${d.meta.id === activeDataset?.meta.id ? 'settings-dataset-row--active' : ''}`}>
                <div>
                  <strong>{d.meta.country}</strong>
                  <span>
                    {d.meta.year} · {d.indicators.length} indicators · v{d.meta.version}
                  </span>
                </div>
                <button
                  className="btn btn--small btn--ghost"
                  disabled={d.meta.id === activeDataset?.meta.id}
                  onClick={() => setActiveDataset(d.meta.id)}
                >
                  {d.meta.id === activeDataset?.meta.id ? 'Active' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Import data" subtitle="Load a dataset as JSON — the dashboard recalculates automatically">
          <p className="settings__text">
            The data layer is separate from the UI. Import a BioCOPPA dataset to replace or extend the mock data:
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleImport(f);
            }}
          />
          <div className="btn-row">
            <button className="btn btn--primary" onClick={() => fileRef.current?.click()}>
              <UploadIcon width={16} height={16} /> Import JSON dataset
            </button>
          </div>
          {importStatus && (
            <p className={`settings__status settings__status--${importStatus.ok ? 'ok' : 'err'}`}>{importStatus.message}</p>
          )}
          <pre className="settings__schema">{`{
  "meta": { "id": "gh-2025", "country": "Ghana",
            "year": 2025, "source": "...", "version": "1.0.0" },
  "indicators": [
    { "id": "gh-1", "code": "RD-01", "name": "...",
      "domain": "research", "section": "...", "description": "...",
      "importance": 4, "performance": 3 }
  ]
}`}</pre>
        </Card>

        <Card title="Appearance" subtitle="Choose a theme for the dashboard">
          <div className="theme-toggle-buttons">
            <button
              className={`theme-choice ${theme === 'light' ? 'theme-choice--active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              <SunIcon />
              <span>Light</span>
            </button>
            <button
              className={`theme-choice ${theme === 'dark' ? 'theme-choice--active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              <MoonIcon />
              <span>Dark</span>
            </button>
          </div>
        </Card>
      </div>

      <Card title="About the calculation engine" subtitle="How every number on this dashboard is computed">
        <div className="formula-grid">
          <div className="formula">
            <span>Weighted Score (per indicator)</span>
            <code>Importance × Performance</code>
          </div>
          <div className="formula">
            <span>Domain Score</span>
            <code>Σ(Importance × Performance) ÷ Σ(Importance)</code>
          </div>
          <div className="formula">
            <span>Overall BioCOPPA Score</span>
            <code>Average of the 3 domain scores</code>
          </div>
          <div className="formula">
            <span>Percentage (0–100)</span>
            <code>((Score − 1) ÷ 4) × 100</code>
          </div>
          <div className="formula">
            <span>Index (0–10)</span>
            <code>((Score − 1) ÷ 4) × 10</code>
          </div>
        </div>
        <p className="settings__note">
          <InfoIcon width={14} height={14} /> Calculations live in <code>src/calc/calculations.ts</code>, fully separated
          from the UI, with unit tests in <code>src/calc/calculations.test.ts</code>.
        </p>
      </Card>
    </div>
  );
}

function validateDataset(d: Dataset): void {
  if (!d || typeof d !== 'object') throw new Error('Invalid file: expected a JSON object.');
  if (!d.meta?.id || !d.meta?.country || typeof d.meta?.year !== 'number') {
    throw new Error('Invalid dataset: meta.id, meta.country and meta.year are required.');
  }
  if (!Array.isArray(d.indicators) || d.indicators.length === 0) {
    throw new Error('Invalid dataset: indicators must be a non-empty array.');
  }
  for (const i of d.indicators) {
    if (!i.code || !i.name || !VALID_DOMAINS.includes(i.domain)) {
      throw new Error(`Invalid indicator: code, name and a valid domain are required.`);
    }
    if (![1, 2, 3, 4, 5].includes(i.importance) || ![1, 2, 3, 4, 5].includes(i.performance)) {
      throw new Error(`Invalid indicator "${i.code}": importance and performance must be 1-5.`);
    }
  }
}
