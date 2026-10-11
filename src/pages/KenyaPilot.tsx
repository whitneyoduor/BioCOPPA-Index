import { Link } from 'react-router-dom';
import { CheckList, PageHeader, Section } from '../components/Page';

const INSTITUTIONS = [
  'Pest Control Products Board (PCPB)',
  'Kenya Plant Health Inspectorate Service (KEPHIS)',
  'Ministry of Agriculture',
  'National Museums of Kenya',
  'Research institutions',
  'Academia',
  'Biologicals industry',
  'Pest control and crop protection industry',
];

const OBJECTIVES_ITEMS = [
  'Present the BioCOPPA Index framework and methodology.',
  'Validate the relevance of the indicators within the Kenyan context.',
  'Assess the clarity, completeness, and practicality of the assessment criteria.',
  'Identify strengths and gaps in Kenya&rsquo;s regulatory and institutional environment.',
  'Gather expert input from national stakeholders.',
  'Support refinement of the BioCOPPA indicators and scoring methodology.',
  'Build national ownership and understanding of the index.',
  'Support future application of the BioCOPPA Index in Kenya.',
];

const INSIGHTS_ITEMS = [
  'Growing national interest in biologicals and biopesticides as part of sustainable agriculture and integrated pest management.',
  'Existing progress in regulation alongside the need for clearer and more tailored pathways for biological product registration.',
  'The importance of collaboration between regulatory authorities, research institutions, government, and industry.',
  'Capacity-building needs in risk assessment, product evaluation, and stewardship.',
  'The need to strengthen approval, monitoring, and post-registration systems.',
  'Strong support for BioCOPPA as a diagnostic and planning tool for policy and regulatory improvements.',
];

export function KenyaPilot() {
  return (
    <>
      <PageHeader
        kicker="Kenya Pilot"
        title="BioCOPPA Kenya — 29 April 2026"
        intro="The BioCOPPA Index was piloted in Kenya on 29 April 2026 in Nairobi through a national stakeholder validation workshop hosted at the Pest Control Products Board (PCPB)."
      />

      <Section className="section--white" kicker="The workshop">
        <div className="prose">
          <p>
            The workshop brought together stakeholders from government agencies, research institutions,
            academia, and the pest control and crop protection industry to review and validate the BioCOPPA
            framework within the Kenyan context.
          </p>
        </div>
        <h3 className="domain-group__heading">Participating institutions</h3>
        <ul className="tag-list">
          {INSTITUTIONS.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Section>

      <Section kicker="Why the pilot" title="Objectives of the Kenya Pilot" className="section--cream">
        <CheckList items={OBJECTIVES_ITEMS} />
      </Section>

      <Section
        kicker="What was learned"
        title="Key Insights from the Kenya Pilot"
        className="section--white"
      >
        <p className="section-head__intro">Stakeholder discussions identified:</p>
        <CheckList items={INSIGHTS_ITEMS} />
      </Section>

      <Section kicker="Next steps" title="Using the Tool in Kenya" className="section--cream">
        <div className="callout">
          <p>
            The BioCOPPA Index provides a structured way to transform stakeholder assessments into an
            evidence-based assessment of a country&rsquo;s biological crop protection environment. Following
            the pilot, the tool can be used to examine overall performance, each domain and subdomain,
            individual indicators, sector strengths and gaps, and priority areas for intervention — supporting
            policy and regulatory dialogue in Kenya and beyond.
          </p>
        </div>
      </Section>

      <section className="cta">
        <div className="container cta__inner">
          <div className="cta__content">
            <p className="cta__kicker">Participate</p>
            <h2 className="cta__headline">Contribute to the BioCOPPA country assessment</h2>
            <p className="cta__caption">
              Stakeholders in the biological crop protection sector can share their perspective on indicator
              importance and performance through the BioCOPPA assessment form.
            </p>
            <Link to="/calculator" className="btn btn--gold">
              Open the Score Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
