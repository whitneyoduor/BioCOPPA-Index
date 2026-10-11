import { Link } from 'react-router-dom';
import { CheckList, PageHeader, Section } from '../components/Page';

const DEVELOPMENT_STEPS = [
  {
    title: 'Conceptual development',
    text: 'Systems thinking, a review of the evidence base and participatory virtual workshops were used to conceptualise the biological crop protection system and inform the initial framework.',
  },
  {
    title: 'Stakeholder validation',
    text: '82 candidate indicators across the three domains were subjected to stakeholder validation through relevance assessment and qualitative feedback during a multi-country workshop in South Africa.',
  },
  {
    title: 'Refinement and operationalisation',
    text: 'Validation findings informed the final BioCOPPA methodology, incorporating separate Importance and Performance assessments, stakeholder eligibility and balancing procedures, and domain and composite scoring.',
  },
  {
    title: 'Pilot application',
    text: 'The framework was piloted through a national stakeholder workshop in Kenya to assess its applicability and practical use within a country setting.',
  },
];

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
        intro="The BioCOPPA Index is a systems-based framework for assessing enabling environments for biological crop protection products in Africa and the Middle East."
      />

      <Section className="section--white">
        <div className="prose">
          <p>
            The Biological Crop Protection Products Access (BioCOPPA) Index is a stakeholder-informed,
            co-created, systems-based framework designed to measure, assess and track the enabling environment
            within which biological crop protection products are researched, developed, regulated,
            commercialised and made accessible.
          </p>
          <p>
            The framework integrates three interconnected domains: <strong>Research and Development</strong>,{' '}
            <strong>Industry Competitiveness</strong>, and <strong>Policy and Regulatory Frameworks</strong>.
            Rather than using any single component as a proxy for the overall development of the sector,
            BioCOPPA provides a common structure for assessing these dimensions while retaining domain-level
            information for diagnostic interpretation.
          </p>
          <p>
            BioCOPPA is a diagnostic and benchmarking tool rather than a country-ranking or causal assessment
            tool. Its value lies not only in the composite score but also in the domain and indicator-level
            results that help identify areas requiring targeted research, regulatory, institutional or market
            interventions.
          </p>
        </div>
      </Section>

      <Section kicker="How the index was built" title="A Four-Stage Development Process" className="section--cream">
        <p className="section-head__intro">
          The Index was conceived in recognition of the complex interplay of scientific, regulatory,
          institutional and market factors, and co-developed with stakeholders through a four-stage process.
        </p>
        <div className="steps">
          {DEVELOPMENT_STEPS.map((step, i) => (
            <div key={step.title} className="step">
              <span className="step__num">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="Stakeholder validation" title="Validated by Stakeholders Across Africa" className="section--white">
        <div className="two-col">
          <p>
            Candidate indicators were subjected to stakeholder validation during a participatory workshop held in
            South Africa, involving 147 stakeholders from 18 African countries representing regulatory agencies,
            research institutions, industry and other value-chain actors.
          </p>
          <p>
            Stakeholders assessed the relevance of each candidate indicator and provided qualitative feedback on
            clarity, completeness and practical usefulness. The combined quantitative and qualitative findings
            were used to refine the framework before it was operationalised as a country-assessment instrument.
          </p>
        </div>
      </Section>

      <Section kicker="What it provides" title="What the BioCOPPA Tool Provides" className="section--cream">
        <p className="section-head__intro">
          The BioCOPPA Index provides a structured way to transform stakeholder assessments into an
          evidence-based assessment of a country&rsquo;s biological crop protection environment. The tool can be
          used to examine:
        </p>
        <CheckList items={PROVIDES_ITEMS} />
      </Section>

      <Section kicker="Using the results" title="Interpreting the Index" className="section--white">
        <p className="section-head__intro">
          The overall index should be interpreted together with its underlying domains rather than as a
          standalone measure. Regular measurement has been suggested at approximately three-year intervals. The
          index allows users to:
        </p>
        <CheckList items={INTERPRETATION_ITEMS} />
      </Section>

      <Section
        kicker="Overall objective"
        title="A Common Framework for the Enabling Environment"
        className="section--cream"
      >
        <div className="callout">
          <p>
            BioCOPPA is intended to provide a common, measurable framework for understanding whether a
            country&rsquo;s environment is sufficiently supportive of the development, registration, production,
            distribution, accessibility and adoption of biological crop protection products.
          </p>
          <p>
            By identifying systemic strengths and gaps, the index can help stakeholders determine where policy
            reforms, regulatory improvements, research investment, capacity building, institutional
            strengthening and collaboration may be most needed.
          </p>
          <p>
            <Link to="/assessment" className="btn btn--gold">
              Take the BioCOPPA Assessment
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}