import { Link } from 'react-router-dom';
import { PageHeader, Section } from '../components/Page';

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfFTqfTuCHGCM7Qu9AywUEddvjHs3LQTWEiolelgn8wgUZCuQ/viewform?usp=header';
const FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfFTqfTuCHGCM7Qu9AywUEddvjHs3LQTWEiolelgn8wgUZCuQ/viewform?embedded=true';

const STAKEHOLDER_GROUPS = [
  'Regulators',
  'Policy Actors',
  'Research and Academia',
  'Farmers',
  'Industry Players',
  'NGOs / Development Organisations',
  'Value-Chain Actors',
];

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

function ScaleRows({ rows, tinted }: { rows: string[][]; tinted?: boolean }) {
  return (
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
  );
}

export function Assessment() {
  return (
    <>
      <PageHeader
        kicker="Country Assessment"
        title="Take the BioCOPPA Assessment"
        intro="The BioCOPPA Index assesses the enabling environment for the development, regulation, availability and use of biological crop protection products. Your responses will help identify strengths, gaps and opportunities."
      />

      <Section kicker="How it works" title="Before You Begin" className="section--white">
        <div className="prose">
          <p>
            The assessment covers three areas: <strong>Research &amp; Development</strong>,{' '}
            <strong>Industry Competitiveness</strong>, and <strong>Policy &amp; Regulatory Frameworks</strong>.
            You will be presented with a series of indicators. For each indicator you provide two ratings:
          </p>
          <p>
            <strong>Importance</strong> — how important you consider the indicator to be.
          </p>
          <p>
            <strong>Performance / Status</strong> — how well you believe the country currently performs in
            relation to the indicator.
          </p>
          <p className="section__note">
            Please base your responses on your knowledge and experience of the current situation in the
            country being assessed.
          </p>
        </div>
        <div className="scale-grid">
          <div className="scale-table">
            <h3 className="scale-table__title">Importance scale</h3>
            <ScaleRows rows={IMPORTANCE_SCALE} />
          </div>
          <div className="scale-table">
            <h3 className="scale-table__title">Performance / status scale</h3>
            <ScaleRows rows={PERFORMANCE_SCALE} tinted />
          </div>
        </div>
        <div className="domain-group">
          <h3 className="domain-group__heading">Who can take part</h3>
          <p className="section__note">
            The country assessment incorporates perspectives from seven stakeholder groups. Respondents with
            more than three years of experience in the biological crop protection sector, and at least ten
            eligible respondents per group, are required for the calculation of a national index score.
          </p>
          <ul className="tag-list">
            {STAKEHOLDER_GROUPS.map((group) => (
              <li key={group}>{group}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section kicker="Consent" title="Participation and Data Use" className="section--cream">
        <div className="callout">
          <p>
            Participation is voluntary. The information you provide, including your contact and professional
            information, will be collected and used for BioCOPPA Index assessment, analysis and reporting
            purposes. The form opens in Google Forms.
          </p>
        </div>
      </Section>

      <Section kicker="The assessment form" title="BioCOPPA Index Assessment" className="section--white">
        <div className="form-embed">
          <iframe
            src={FORM_EMBED_URL}
            title="BioCOPPA Index Assessment form"
            width="100%"
            height="1440"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading the BioCOPPA Index Assessment form…
          </iframe>
        </div>
        <div className="form-embed__fallback">
          <p>If the form does not load above, open it directly:</p>
          <a
            className="btn btn--green"
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the BioCOPPA Assessment
          </a>
        </div>
      </Section>

      <Section kicker="After you participate" title="What Happens Next" className="section--cream">
        <div className="prose">
          <p>
            Responses are balanced across stakeholder groups, combined into weighted indicator and domain
            scores, and aggregated into an overall BioCOPPA Index for the country. The results help identify
            strengths, gaps and priority areas for intervention across the biological crop protection system.
          </p>
          <p>
            <Link to="/methodology" className="btn btn--green">
              Read the Methodology
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}