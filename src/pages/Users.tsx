import { Link } from 'react-router-dom';
import { CheckList, CtaBanner, PageHeader, Section } from '../components/Page';

const USERS_ITEMS = [
  'Regulators',
  'Policy actors',
  'Research institutions and academia',
  'Farmers and farmer organisations',
  'Industry players and biological crop protection companies',
  'NGOs and development organisations',
  'Value-chain actors',
  'Government agencies',
  'Investors',
  'Other organisations involved in sustainable agriculture and biological crop protection',
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

export function Users() {
  return (
    <>
      <PageHeader
        kicker="Who it is for"
        title="Intended Users"
        intro="The BioCOPPA Index is designed to support evidence-based decision-making across the biological crop protection sector."
      />

      <Section kicker="Who can use the index" title="Who can use the BioCOPPA Index">
        <div className="user-grid">
          {USERS_ITEMS.map((user) => (
            <div key={user} className="user-card">
              <span className="user-card__dot" aria-hidden="true" />
              {user}
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="Contribute your perspective" title="Taking Part in the Assessment" className="section--cream">
        <div className="prose">
          <p>
            The country assessment captures perspectives from seven stakeholder groups representing different
            components of the biological crop protection system: regulators, policy actors, research and
            academia, farmers, industry players, NGOs and development organisations, and value-chain actors.
          </p>
          <p>
            For each indicator, you rate its <strong>importance</strong> on a five-point scale and the{' '}
            <strong>performance</strong> of the country against that indicator. Responses help build a
            stakeholder-informed picture of the enabling environment.
          </p>
          <p>
            <Link to="/assessment" className="btn btn--green">
              Take the BioCOPPA Assessment
            </Link>
          </p>
        </div>
      </Section>

      <Section kicker="What it provides" title="What the Tool Can Be Used For" className="section--cream">
        <p className="section-head__intro">
          The BioCOPPA Index provides a structured way to transform stakeholder assessments into an
          evidence-based assessment of a country&rsquo;s biological crop protection environment. It can be
          used to examine:
        </p>
        <CheckList items={PROVIDES_ITEMS} />
      </Section>

      <Section kicker="How to use it" title="Getting Started" className="section--white">
        <div className="steps">
          <div className="step">
            <span className="step__num">01</span>
            <h3>Assess importance</h3>
            <p>Stakeholders rate how important each indicator is for strengthening the sector, on a 1–5 scale.</p>
          </div>
          <div className="step">
            <span className="step__num">02</span>
            <h3>Assess performance</h3>
            <p>Stakeholders rate the country&rsquo;s current performance for each indicator, on a 1–5 scale.</p>
          </div>
          <div className="step">
            <span className="step__num">03</span>
            <h3>Calculate the index</h3>
            <p>The ratings are combined into a weighted, comparable country-level index.</p>
          </div>
        </div>
      </Section>

      <CtaBanner
        kicker="Methodology"
        title="See how stakeholder ratings become a country-level index"
        caption="Importance and performance combine into weighted indicator scores, domain scores, and an overall BioCOPPA index."
        buttonText="Read the Methodology"
        buttonTo="/methodology"
      />
    </>
  );
}
