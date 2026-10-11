import { Link } from 'react-router-dom';
import { CheckList, PageHeader, Section } from '../components/Page';

const IMPORTANCE_SCALE = [
  ['1', 'Very Low'],
  ['2', 'Low'],
  ['3', 'Moderate'],
  ['4', 'High'],
  ['5', 'Very High'],
];

const PERFORMANCE_SCALE = [
  ['1', 'Very Weak'],
  ['2', 'Low'],
  ['3', 'Moderate'],
  ['4', 'Strong'],
  ['5', 'Very Strong / Mature'],
];

function ScaleTable({ title, rows, tinted }: { title: string; rows: string[][]; tinted?: boolean }) {
  return (
    <div className="scale-table">
      <h3 className="scale-table__title">{title}</h3>
      <table className="data-table">
        <tbody>
          {rows.map(([value, label]) => (
            <tr key={value}>
              <td className={`data-table__value ${tinted ? 'data-table__value--gold' : ''}`}>{value}</td>
              <td>{label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Formula({ label, expression, note }: { label: string; expression: string; note?: string }) {
  return (
    <div className="formula">
      <p className="formula__label">{label}</p>
      <p className="formula__expression">{expression}</p>
      {note && <p className="formula__note">{note}</p>}
    </div>
  );
}

const STAKEHOLDER_GROUPS = [
  'Regulators',
  'Policy Actors',
  'Research and Academia',
  'Farmers',
  'Industry Players',
  'NGOs / Development Organisations',
  'Value-Chain Actors',
];

const ELIGIBILITY_ITEMS = [
  'Respondents report their stakeholder category and years of experience in the biological crop protection sector.',
  'Eligible respondents are those reporting more than three years of experience in the sector.',
  'Responses from participants with under three years of experience may be retained in the dataset but are excluded from calculation of the country index.',
  'A minimum of 10 eligible respondents is required from each of the seven stakeholder groups.',
  'The theoretical minimum sample for a country assessment is therefore Nmin = 7 × 10 = 70 eligible respondents.',
  'A country with 70 or more eligible respondents does not automatically qualify if any single stakeholder group contains fewer than 10 eligible respondents.',
];

const INTERPRETATION_ITEMS = [
  'Establish a country-level performance measure.',
  'Identify the strongest and weakest domains.',
  'Identify high-performing and low-performing indicators.',
  'Identify indicators that are highly important but comparatively weak in performance.',
  'Identify priority areas for intervention.',
  'Support policy and regulatory dialogue.',
  'Track changes in performance through repeated assessments.',
];

export function Methodology() {
  return (
    <>
      <PageHeader
        kicker="Methodology"
        title="How the BioCOPPA Index Is Calculated"
        intro="The country assessment uses two stakeholder ratings for each indicator — Importance and Performance — combined through stakeholder balancing and importance weighting."
      />

      <Section kicker="Step 1 — Stakeholder ratings" title="The Two Rating Scales" className="section--white">
        <p className="section__lead">
          For each indicator, respondents separately assess Importance and Performance. Importance and
          Performance are assessed independently because an indicator may be highly important while performing
          poorly within a particular country.
        </p>
        <div className="scale-grid">
          <ScaleTable title="Importance" rows={IMPORTANCE_SCALE} />
          <ScaleTable title="Performance / Status" rows={PERFORMANCE_SCALE} tinted />
        </div>
      </Section>

      <Section
        kicker="Step 2 — Respondent eligibility"
        title="Stakeholder Representation"
        className="section--cream"
      >
        <p className="section__lead">
          The country assessment incorporates perspectives from seven stakeholder groups representing
          different components of the biological crop protection system.
        </p>
        <ul className="tag-list">
          {STAKEHOLDER_GROUPS.map((group) => (
            <li key={group}>{group}</li>
          ))}
        </ul>
        <div className="domain-group">
          <CheckList items={ELIGIBILITY_ITEMS} columns={1} />
        </div>
      </Section>

      <Section kicker="Step 3 — Stakeholder balancing" title="Balancing Stakeholder Influence" className="section--white">
        <p className="section__lead">
          Where the eligibility requirements are satisfied, responses are balanced across the seven stakeholder
          groups before calculation, so that each group contributes equally to a country assessment regardless
          of differences in the number of eligible respondents.
        </p>
        <Formula
          label="Group mean"
          expression="X̄icg = mean of the scores within stakeholder group g"
          note="The mean response is calculated for indicator i, country c and stakeholder group g."
        />
        <Formula
          label="Balanced country mean"
          expression="X̄ic = (1 / 7) × Σ X̄icg  for g = 1 … 7"
          note="The country-level indicator mean is the unweighted mean of the seven stakeholder-group means, applied separately to Importance and Performance."
        />
      </Section>

      <Section
        kicker="Step 4 — Indicator weighting and domain scores"
        title="Weighted Indicator and Domain Scores"
        className="section--cream"
      >
        <p className="section__lead">
          Importance scores are used as weights when aggregating indicator Performance within each domain.
        </p>
        <Formula
          label="Indicator weighted contribution"
          expression="Wic = Iic × Pic"
          note="Ranges from 1 to 25; this is an indicator-level contribution, not the final BioCOPPA score."
        />
        <Formula
          label="Domain score"
          expression="Ddc = Σ (Iic × Pic) ÷ Σ Iic  for i ∈ d"
          note="The Importance-weighted mean of indicator Performance, retained on the original 1–5 scale."
        />
      </Section>

      <Section kicker="Step 5 — Overall index" title="The Overall BioCOPPA Index" className="section--white">
        <p className="section__lead">
          The three domain scores are assigned equal weight and averaged into the composite index, preventing any
          single domain from dominating the overall score.
        </p>
        <Formula
          label="Overall index"
          expression="BIc = (D_RD,c + D_IC,c + D_PR,c) ÷ 3"
          note="BIc is the overall BioCOPPA Index for country c, on the 1–5 scale."
        />
        <Formula
          label="Conversion to a 0–100 scale"
          expression="S₀₋₁₀₀ = ((S₁₋₅ − 1) ÷ 4) × 100"
          note="A linear transformation of the underlying 1–5 scale — not a percentile or a percentage of sector development achieved. Scores may also be expressed on a 0–10 scale."
        />
      </Section>

      <Section kicker="Reading the results" title="Interpreting the Index" className="section--white">
        <p className="section-head__intro">
          The overall index provides a summary measure, while domain and indicator results retain the
          diagnostic information needed to identify relative strengths and constraints. A higher BioCOPPA score
          indicates a stronger and more developed enabling environment. The overall index should be interpreted
          together with its underlying domains rather than as a standalone measure.
        </p>
        <CheckList items={INTERPRETATION_ITEMS} />
        <p className="section__note">
          Country comparisons are made only for assessments that satisfy the respondent eligibility and
          stakeholder-representation requirements. Countries with insufficient samples may retain descriptive
          information but are not assigned a national BioCOPPA score.
        </p>
        <div className="section__actions">
          <Link to="/calculator" className="btn btn--green">
            Open the Score Calculator
          </Link>
        </div>
      </Section>
    </>
  );
}
