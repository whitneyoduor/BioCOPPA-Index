import type { DomainDefinition, DomainId } from './types';

export const DOMAINS: DomainDefinition[] = [
  {
    id: 'research',
    label: 'Research & Development',
    shortLabel: 'R&D',
    color: '#6289b5',
    softColor: '#e9f0f7',
    description:
      'Institutional capacity, testing, dissemination, and investment in research for biological crop protection products.',
    sections: [
      {
        name: 'Institutional Landscape & Capacity',
        description: 'Research institutions, laboratories and scientific expertise for biological control.',
      },
      {
        name: 'Testing & Dissemination',
        description: 'Capacity to run efficacy trials and to transfer technology to end users.',
      },
      {
        name: 'R&D Investment & Output',
        description: 'Public and private investment and tangible research outputs.',
      },
    ],
  },
  {
    id: 'industry',
    label: 'Industry Competitiveness',
    shortLabel: 'Industry',
    color: '#b08d55',
    softColor: '#f6f0e4',
    description:
      'The ability of the private sector to produce, register, distribute and grow markets for biological products.',
    sections: [
      {
        name: 'Production & Registration',
        description: 'Domestic manufacturing capacity and a workable registration pathway.',
      },
      {
        name: 'Distribution & Access',
        description: 'Reach and affordability of biological products through supply chains.',
      },
      {
        name: 'Market Dynamics',
        description: 'Demand, growth and private investment in the biological product market.',
      },
    ],
  },
  {
    id: 'policy',
    label: 'Policy & Regulatory Framework',
    shortLabel: 'Policy',
    color: '#8476ad',
    softColor: '#efecf6',
    description:
      'The enabling policy, regulatory, institutional and quality assurance environment for biological products.',
    sections: [
      {
        name: 'Policy Framework',
        description: 'National strategy and policy alignment for biological crop protection.',
      },
      {
        name: 'Institutional Support',
        description: 'Regulatory authorities and coordination across agencies.',
      },
      {
        name: 'Quality Control',
        description: 'Standards for efficacy, quality and safety data.',
      },
      {
        name: 'Monitoring',
        description: 'Enforcement, monitoring and trade harmonisation.',
      },
    ],
  },
];

export const DOMAIN_BY_ID: Record<DomainId, DomainDefinition> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, DomainDefinition>;
