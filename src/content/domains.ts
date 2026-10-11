export interface DomainGroup {
  heading: string;
  items: string[];
}

export interface DomainContent {
  id: 'research' | 'industry' | 'policy';
  title: string;
  shortTitle: string;
  kicker: string;
  short: string;
  description: string;
  groups: DomainGroup[];
}

export const DOMAIN_CONTENT: DomainContent[] = [
  {
    id: 'research',
    title: 'Research & Development',
    shortTitle: 'Research & Development',
    kicker: 'Domain 1',
    short:
      'The scientific, technical and institutional conditions required to generate and test biological crop protection innovations.',
    description:
      'Research and Development captures the scientific, technical and institutional conditions required to generate, test and disseminate biological crop protection innovations.',
    groups: [
      {
        heading: 'Institutional Landscape and Capacity',
        items: [
          'Institutions involved in biopesticide research and development',
          'Capacity of research institutions',
          'Collaboration between academia, government, the private sector and farmers',
          'Registered biopesticide information and inventories',
          'R&D funding and investment',
          'Trained professionals',
          'Research infrastructure, laboratories, greenhouses and pilot production facilities',
          'Producer and farmer organisations',
        ],
      },
      {
        heading: 'Capacities for Testing and Dissemination',
        items: [
          'Accredited testing facilities',
          'Products in testing pipelines',
          'Indigenous knowledge',
          'Extension capacity',
          'Training and capacity-building',
          'Knowledge-sharing platforms',
        ],
      },
      {
        heading: 'R&D Investment and Output',
        items: [
          'Locally and externally developed products',
          'Adoption of products and technologies',
          'Research publications',
          'Registered products',
          'Patents and research outputs',
        ],
      },
    ],
  },
  {
    id: 'industry',
    title: 'Industry Competitiveness',
    shortTitle: 'Industry Competitiveness',
    kicker: 'Domain 2',
    short:
      'Conditions influencing product development, commercialisation, production, distribution and market access.',
    description:
      'Industry Competitiveness captures the conditions influencing product development, commercialisation, production, distribution and market access for biological crop protection products.',
    groups: [
      {
        heading: 'Production and Registration',
        items: [
          'Number of active industry players',
          'Access to formulation and manufacturing technologies',
          'Local manufacturing requirements',
          'Ease, time and cost of product registration',
          'Compliance with safety and quality standards',
          'Number of approved and registered products',
          'Product diversity',
          'Regulatory efficiency',
          'Incubation and manufacturing hubs',
          'Accredited laboratories',
          'Regional harmonisation of registration and production requirements',
        ],
      },
      {
        heading: 'Distribution and Access',
        items: [
          'Farmer adoption and use',
          'Value-chain development',
          'Farmer awareness',
          'Availability of agrodealers',
          'Distribution network coverage',
          'Availability of products in rural and urban areas',
          'Affordability for smallholder farmers',
          'Distribution lead times',
          'Supply-chain reliability',
          'Storage and handling capacity',
          'Government support and input programmes',
          'Access to technical information and user guidance',
          'After-sales support',
        ],
      },
      {
        heading: 'Market Dynamics',
        items: [
          'Diversity and competitiveness of producers and sellers',
          'Number of biopesticide companies',
          'Market volume and value',
          'Annual market growth',
          'Investment climate',
          'Incentives and subsidies',
          'Regulatory and tax conditions',
          'Farmer feedback mechanisms',
          'Proportion of locally produced versus imported products',
        ],
      },
    ],
  },
  {
    id: 'policy',
    title: 'Policy and Regulatory Frameworks',
    shortTitle: 'Policy & Regulatory Frameworks',
    kicker: 'Domain 3',
    short:
      'The institutional and regulatory conditions affecting product evaluation, registration, quality assurance and market oversight.',
    description:
      'Policy and Regulatory Frameworks captures the institutional and regulatory conditions affecting product evaluation, registration, quality assurance and market oversight.',
    groups: [
      {
        heading: 'Policy and Regulatory Frameworks',
        items: [
          'National and regional policies',
          'Laws governing biopesticides',
          'Regulations',
          'Administrative procedures and guidelines',
          'Definitions and categorisation of biopesticides',
          'Data requirements',
          'Coordination among regulatory bodies',
          'Supportive initiatives',
          'Regulatory transparency and predictability',
          'Stakeholder engagement',
          'Regulatory agency capacity',
          'Trained personnel',
          'Quality-control and testing facilities',
          'Harmonised guidelines',
          'Alignment with international standards',
          'Industry codes of practice and self-regulation',
        ],
      },
      {
        heading: 'Institutional Support for Registration',
        items: [
          'Officials with expertise in dossier evaluation',
          'Clarity of registration procedures',
          'Specialist training for regulatory personnel',
          'Risk assessment protocols',
        ],
      },
      {
        heading: 'Quality Control, Certification and Post-registration Surveillance',
        items: [
          'Quality standards',
          'Testing and certification facilities',
          'Regulatory agencies and personnel',
          'Laboratory infrastructure',
          'Efficiency of laboratory testing and approval',
          'Response to non-compliance',
          'Inspection and testing mechanisms',
          'Monitoring and surveillance systems',
          'Tracking of production, distribution and farmer feedback',
        ],
      },
    ],
  },
];
