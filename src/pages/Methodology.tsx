import { CheckList, PageHeader, Section } from '../components/Page';

const IMPORTANCE_SCALE = [
  ['1', 'Not Important'],
  ['2', 'Slightly Important'],
  ['3', 'Moderately Important'],
  ['4', 'Important'],
  ['5', 'Very Important'],
];

const PERFORMANCE_SCALE = [
  ['1', 'Very Weak'],
  ['2', 'Low'],
  ['3', 'Moderate / Emerging'],
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

export function Methodology() {
  return (
    <>
      <PageHeader
        kicker="Methodology"
        title="How the BioCOPPA Index Is Calculated"
        intro="The index uses two types of stakeholder ratings for each indicator: importance and performance."
      />

      <Section kicker="Step 1 — Stakeholder ratings" title="The Two Rating Scales" className="section--white">
        <div className="scale-grid">
          <ScaleTable title="Importance" rows={IMPORTANCE_SCALE} />
          <ScaleTable title="Performance / Status" rows={PERFORMANCE_SCALE} tinted />
        </div>
        <p className="section__note">
          Stakeholders assess how important an indicator is for strengthening the biological crop protection
          sector, and how developed or well-performing that indicator is in the country.
        </p>
      </Section>

      <Section
        kicker="Step 2 — Indicator calculation"
        title="Weighted Indicator Score"
        className="section--cream"
      >
        <p className="section__lead">
          The importance and performance ratings are combined for each indicator.
        </p>
        <Formula label="Indicator calculation" expression="Weighted Indicator Score = Importance × Performance" />
      </Section>

      <Section kicker="Step 3 — Domain calculation" title="Domain Scores" className="section--white">
        <p className="section__lead">
          Indicators within each domain are aggregated using their importance as weights.
        </p>
        <Formula
          label="Domain calculation"
          expression="Domain Score = Σ(Importance × Performance) ÷ Σ Importance"
          note="The resulting domain score remains on a 1–5 scale."
        />
      </Section>

      <Section
        kicker="Step 4 — Overall index"
        title="The Overall BioCOPPA Index"
        className="section--cream"
      >
        <p className="section__lead">The three domain scores are combined into the overall index.</p>
        <Formula
          label="Overall index"
          expression="Overall Index = (R&D Score + Industry Score + Policy Score) ÷ 3"
        />
        <Formula
          label="Conversion to a 0–100 scale"
          expression="Index (%) = Overall Score ÷ 5 × 100"
          note="The index may also be expressed on a 0–10 scale."
        />
      </Section>

      <Section kicker="Reading the results" title="Interpreting the Index" className="section--white">
        <p className="section-head__intro">
          A higher BioCOPPA score indicates a stronger and more developed enabling environment for biological
          crop protection products. A lower score indicates areas that may require greater attention. Regular
          measurement has been suggested at approximately three-year intervals.
        </p>
        <CheckList items={INTERPRETATION_ITEMS} />
      </Section>
    </>
  );
}
