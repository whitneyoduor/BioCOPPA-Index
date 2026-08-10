import type { Dataset, Level } from './types';

interface Seed {
  code: string;
  name: string;
  domain: 'research' | 'industry' | 'policy';
  section: string;
  description: string;
  importance: Level;
  malawi: Level;
  kenya: Level;
}

const R = 'research';
const I = 'industry';
const P = 'policy';

const INDICATORS: Seed[] = [
  // ---------------- Research & Development ----------------
  {
    code: 'RD-01',
    name: 'Active biocontrol research institutions',
    domain: R,
    section: 'Institutional Landscape & Capacity',
    description: 'Universities and research centres running active programmes on biological control.',
    importance: 4,
    malawi: 3,
    kenya: 4,
  },
  {
    code: 'RD-02',
    name: 'Specialised biocontrol laboratories',
    domain: R,
    section: 'Institutional Landscape & Capacity',
    description: 'Functional labs for rearing, formulation and quality testing of biocontrol agents.',
    importance: 4,
    malawi: 2,
    kenya: 3,
  },
  {
    code: 'RD-03',
    name: 'Trained scientific & extension expertise',
    domain: R,
    section: 'Institutional Landscape & Capacity',
    description: 'Availability of researchers, technicians and extension staff skilled in biological control.',
    importance: 5,
    malawi: 3,
    kenya: 3,
  },
  {
    code: 'RD-04',
    name: 'Field efficacy trial capacity',
    domain: R,
    section: 'Testing & Dissemination',
    description: 'Ability to design and run scientifically sound field and laboratory efficacy trials.',
    importance: 5,
    malawi: 3,
    kenya: 4,
  },
  {
    code: 'RD-05',
    name: 'Technology dissemination & farmer training',
    domain: R,
    section: 'Testing & Dissemination',
    description: 'Knowledge transfer of biological products through demonstrations and advisory services.',
    importance: 4,
    malawi: 2,
    kenya: 3,
  },
  {
    code: 'RD-06',
    name: 'Public R&D investment in biological control',
    domain: R,
    section: 'R&D Investment & Output',
    description: 'Budget allocation and funding schemes dedicated to biological crop protection research.',
    importance: 4,
    malawi: 2,
    kenya: 3,
  },
  {
    code: 'RD-07',
    name: 'Research output & product prototypes',
    domain: R,
    section: 'R&D Investment & Output',
    description: 'Publications, trials reports and product prototypes reaching advanced development stages.',
    importance: 3,
    malawi: 3,
    kenya: 3,
  },

  // ---------------- Industry Competitiveness ----------------
  {
    code: 'IN-01',
    name: 'Domestic biocontrol manufacturers',
    domain: I,
    section: 'Production & Registration',
    description: 'Local firms producing or formulating biological crop protection products.',
    importance: 4,
    malawi: 2,
    kenya: 3,
  },
  {
    code: 'IN-02',
    name: 'Workable registration pathway for biopesticides',
    domain: I,
    section: 'Production & Registration',
    description: 'A clear, proportionate and timely process to register biological products.',
    importance: 5,
    malawi: 3,
    kenya: 4,
  },
  {
    code: 'IN-03',
    name: 'Import & export facilitation',
    domain: I,
    section: 'Production & Registration',
    description: 'Low-friction procedures for importing active ingredients and exporting finished products.',
    importance: 4,
    malawi: 2,
    kenya: 3,
  },
  {
    code: 'IN-04',
    name: 'Distribution networks & agro-dealer coverage',
    domain: I,
    section: 'Distribution & Access',
    description: 'Reach of biological products through distributors and agro-dealer outlets.',
    importance: 4,
    malawi: 2,
    kenya: 3,
  },
  {
    code: 'IN-05',
    name: 'Price competitiveness of biological products',
    domain: I,
    section: 'Distribution & Access',
    description: 'Affordability of biological products relative to conventional pesticides.',
    importance: 5,
    malawi: 3,
    kenya: 3,
  },
  {
    code: 'IN-06',
    name: 'Market demand for biological products',
    domain: I,
    section: 'Market Dynamics',
    description: 'Grower adoption and demand signals that sustain a viable market.',
    importance: 4,
    malawi: 3,
    kenya: 4,
  },
  {
    code: 'IN-07',
    name: 'Private sector investment & innovation',
    domain: I,
    section: 'Market Dynamics',
    description: 'Capital, product development and innovation activity by the private sector.',
    importance: 3,
    malawi: 2,
    kenya: 3,
  },

  // ---------------- Policy & Regulatory Framework ----------------
  {
    code: 'PL-01',
    name: 'National biopesticide policy & strategy',
    domain: P,
    section: 'Policy Framework',
    description: 'A national policy or strategy explicitly covering biological crop protection products.',
    importance: 5,
    malawi: 3,
    kenya: 4,
  },
  {
    code: 'PL-02',
    name: 'Policy alignment with IPM & sustainability',
    domain: P,
    section: 'Policy Framework',
    description: 'Integration of biological control into integrated pest management and agri-sustainability plans.',
    importance: 4,
    malawi: 3,
    kenya: 3,
  },
  {
    code: 'PL-03',
    name: 'Regulatory authority capacity',
    domain: P,
    section: 'Institutional Support',
    description: 'Staff, guidance and technical capability of the pesticide regulator for biological products.',
    importance: 5,
    malawi: 4,
    kenya: 4,
  },
  {
    code: 'PL-04',
    name: 'Inter-agency coordination',
    domain: P,
    section: 'Institutional Support',
    description: 'Cooperation between agriculture, environment and health authorities on biological products.',
    importance: 4,
    malawi: 2,
    kenya: 3,
  },
  {
    code: 'PL-05',
    name: 'Efficacy & quality control standards',
    domain: P,
    section: 'Quality Control',
    description: 'Standards for efficacy, purity and quality assurance of biological products.',
    importance: 5,
    malawi: 3,
    kenya: 4,
  },
  {
    code: 'PL-06',
    name: 'Labelling & safety data requirements',
    domain: P,
    section: 'Quality Control',
    description: 'Proportionate labelling and safety requirements that protect users without overburdening industry.',
    importance: 4,
    malawi: 3,
    kenya: 3,
  },
  {
    code: 'PL-07',
    name: 'Monitoring & enforcement of product use',
    domain: P,
    section: 'Monitoring',
    description: 'Systems to monitor and enforce the safe, correct use of biological products.',
    importance: 4,
    malawi: 2,
    kenya: 3,
  },
  {
    code: 'PL-08',
    name: 'MRLs & regional trade harmonisation',
    domain: P,
    section: 'Monitoring',
    description: 'Maximum residue levels and regional harmonisation enabling trade in treated produce.',
    importance: 3,
    malawi: 2,
    kenya: 3,
  },
];

function toDataset(id: string, country: string, year: number, version: string, pick: (s: Seed) => Level): Dataset {
  return {
    meta: {
      id,
      country,
      year,
      source: 'BioCOPPA stakeholder assessment (mock data)',
      version,
      notes: `Sample dataset generated for demonstration purposes. Replace via the data layer with Excel imports or an API.`,
    },
    indicators: INDICATORS.map((s, idx) => ({
      id: `${id}-${idx + 1}`,
      code: s.code,
      name: s.name,
      domain: s.domain,
      section: s.section,
      description: s.description,
      importance: s.importance,
      performance: pick(s),
    })),
  };
}

/** Mock datasets used for the MVP. Swap this source in `dataService` for real data later. */
export const MOCK_DATASETS: Dataset[] = [
  toDataset('mw-2024', 'Malawi', 2024, '1.0.0', (s) => s.malawi),
  toDataset('ke-2024', 'Kenya', 2024, '1.0.0', (s) => s.kenya),
];
