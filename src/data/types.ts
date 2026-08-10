export type DomainId = 'research' | 'industry' | 'policy';

export type Level = 1 | 2 | 3 | 4 | 5;

export interface Indicator {
  id: string;
  code: string;
  name: string;
  domain: DomainId;
  section: string;
  description: string;
  /** Weight of the indicator within its domain (1-5). */
  importance: Level;
  /** Observed performance / readiness (1-5). */
  performance: Level;
}

export interface DatasetMeta {
  id: string;
  country: string;
  year: number;
  source: string;
  version: string;
  notes?: string;
}

/** A single assessment: one country, one year. */
export interface Dataset {
  meta: DatasetMeta;
  indicators: Indicator[];
}

export interface SectionDefinition {
  name: string;
  description: string;
}

export interface DomainDefinition {
  id: DomainId;
  label: string;
  shortLabel: string;
  color: string;
  softColor: string;
  description: string;
  sections: SectionDefinition[];
}
