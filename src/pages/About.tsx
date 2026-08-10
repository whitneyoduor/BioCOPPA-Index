import { CheckList, PageHeader, Section } from '../components/Page';

const PROVIDES_ITEMS = [
  'Overall country performance',
  'Research and development performance',
  'Industry competitiveness',
  'Policy and regulatory performance',
  'Subdomain performance',
  'Individual indicator performance',
  'Sector strengths',
  'Sector gaps',
  'Priority areas for intervention',
  'Changes in performance over time',
  'Comparisons between countries or assessment periods',
];

const INTERPRETATION_ITEMS = [
  'Establish a country-level performance measure.',
  'Identify the strongest domain.',
  'Identify the weakest domain.',
  'Identify high-performing indicators.',
  'Identify low-performing indicators.',
  'Identify priority areas for intervention.',
  'Support policy and regulatory dialogue.',
  'Track changes in performance through repeated assessments.',
];

export function About() {
  return (
    <>
      <PageHeader
        kicker="About the Index"
        title="About the BioCOPPA Index"
        intro="The BioCOPPA Index is a tool designed to assess the enabling environment for biological crop protection products (BCPPs), including biopesticides and biological control agents."
      />

      <Section className="section--white">
        <div className="prose">
          <p>
            The index measures the extent to which a country&rsquo;s research, industry, policy, regulatory,
            institutional, and market systems support the development, registration, production,
            distribution, accessibility, and adoption of biological crop protection products.
          </p>
          <p>
            BioCOPPA combines stakeholder assessments of the <strong>importance</strong> of specific factors
            with assessments of the country&rsquo;s current <strong>performance</strong> or status in those
            areas. These assessments are used to produce a measurable country-level index.
          </p>
          <p>
            A higher BioCOPPA score indicates a stronger and more developed enabling environment for
            biological crop protection products. A lower score indicates areas where the country may require
            greater attention, investment, capacity building, policy reform, regulatory improvement, or
            institutional support.
          </p>
        </div>
      </Section>

      <Section kicker="What it provides" title="What the BioCOPPA Tool Provides" className="section--cream">
        <p className="section-head__intro">
          The BioCOPPA Index provides a structured way to transform stakeholder assessments into an
          evidence-based assessment of a country&rsquo;s biological crop protection environment. The tool can
          be used to examine:
        </p>
        <CheckList items={PROVIDES_ITEMS} />
      </Section>

      <Section kicker="Using the results" title="Interpreting the Index" className="section--white">
        <p className="section-head__intro">
          Regular measurement has been suggested at approximately three-year intervals. The index allows
          users to:
        </p>
        <CheckList items={INTERPRETATION_ITEMS} />
      </Section>

      <Section
        kicker="Overall objective"
        title="A Common Framework for Understanding the Enabling Environment"
        className="section--cream"
      >
        <div className="callout">
          <p>
            BioCOPPA is intended to provide a common, measurable framework for understanding whether a
            country&rsquo;s environment is sufficiently supportive of the development, registration,
            production, distribution, accessibility, and adoption of biological crop protection products.
          </p>
          <p>
            By identifying systemic strengths and gaps, the index can help stakeholders determine where
            policy reforms, regulatory improvements, research investment, capacity building, institutional
            strengthening, and collaboration may be most needed.
          </p>
        </div>
      </Section>
    </>
  );
}
