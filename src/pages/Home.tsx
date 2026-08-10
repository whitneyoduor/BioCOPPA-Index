import { Link } from 'react-router-dom';
import { CheckList, CtaBanner, Section } from '../components/Page';
import { DOMAIN_CONTENT } from '../content/domains';

const PURPOSE_ITEMS = [
  'Identify the key dimensions and indicators influencing the development and uptake of biological crop protection products.',
  'Measure the enabling environment for biological crop protection products.',
  'Provide a comparable and structured country-level assessment.',
  'Identify strengths, weaknesses, and gaps within the biological crop protection sector.',
  'Identify priority areas for investment, policy reform, capacity building, and collaboration.',
  'Support evidence-based decision-making by governments, regulators, researchers, industry, and development partners.',
  'Track changes in the biological crop protection environment over time.',
];

export function Home() {
  return (
    <>
      <section className="hero">
        <svg className="hero__art" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <g fill="#efcb16" opacity="0.16">
            <path d="M1010 90c-30-4-54-20-70-44l-16-30 38 6c42 8 72 36 84 72 3 9 5 18 5 28-18-14-43-24-68-28-4-1-8-2-12-3" />
            <path d="M1085 175c-26-15-44-38-52-67 28 6 53 22 68 45 8 12 14 26 17 40-14-4-28-12-33-18Z" />
          </g>
          <g fill="#5a8a4e" opacity="0.28">
            <path d="M40 470q90-30 180 0t180 0 180 0 180 0 180 0 180 0 80-10v90H40Z" />
            <path d="M40 500q90-24 180 0t180 0 180 0 180 0 180 0 180 0 80-8v70H40Z" />
            <path d="M40 530q90-20 180 0t180 0 180 0 180 0 180 0 180 0 80-6v50H40Z" />
          </g>
        </svg>

        <div className="container hero__inner">
          <p className="hero__kicker">Biological Crop Protection Products Access Index</p>
          <h1 className="hero__headline">
            Measuring the enabling environment for biological crop protection products
          </h1>
          <p className="hero__tagline">
            A biological crop protection products access research initiative.
          </p>
          <p className="hero__caption">
            The BioCOPPA Index combines stakeholder assessments of importance and current performance to
            produce a measurable, comparable country-level index across research, industry, policy, and
            regulatory systems.
          </p>
          <div className="hero__actions">
            <Link to="/domains" className="btn btn--gold">
              Explore the Three Domains
            </Link>
            <Link to="/methodology" className="btn btn--outline-light">
              Read the Methodology
            </Link>
          </div>
        </div>
      </section>

      <Section id="overview" title="About the Index" className="section--white">
        <div className="two-col">
          <p>
            The Biological Crop Protection Products Access (BioCOPPA) Index is a tool designed to assess the
            enabling environment for biological crop protection products (BCPPs), including biopesticides and
            biological control agents.
          </p>
          <p>
            The index measures the extent to which a country&rsquo;s research, industry, policy, regulatory,
            institutional, and market systems support the development, registration, production, distribution,
            accessibility, and adoption of biological crop protection products.
          </p>
        </div>
        <p className="section__lead">
          BioCOPPA combines stakeholder assessments of the importance of specific factors with assessments of
          the country&rsquo;s current performance or status in those areas. These assessments are used to
          produce a measurable country-level index.
        </p>
      </Section>

      <Section
        id="purpose"
        kicker="What the index is for"
        title="Purpose of the BioCOPPA Index"
        className="section--cream"
      >
        <CheckList items={PURPOSE_ITEMS} />
      </Section>

      <Section
        id="domains"
        kicker="The framework"
        title="The Three BioCOPPA Domains"
        intro="Each domain contributes to a country's overall enabling environment for biological crop protection products."
        className="section--white"
      >
        <div className="card-grid">
          {DOMAIN_CONTENT.map((domain, i) => (
            <article key={domain.id} className="card card--domain">
              <span className="card__num">0{i + 1}</span>
              <p className="card__kicker">{domain.kicker}</p>
              <h3 className="card__title">{domain.shortTitle}</h3>
              <p className="card__text">{domain.short}</p>
              <Link to="/domains" className="card__link">
                Explore this domain <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <section className="pilot-strip">
        <div className="container pilot-strip__inner">
          <div className="pilot-strip__body">
            <p className="pilot-strip__kicker">Kenya Pilot</p>
            <h2 className="pilot-strip__title">
              Validated with national stakeholders in Nairobi
            </h2>
            <p className="pilot-strip__text">
              On 29 April 2026, the BioCOPPA Index was piloted in Kenya through a national stakeholder
              validation workshop hosted at the Pest Control Products Board (PCPB) in Nairobi.
            </p>
            <Link to="/kenya" className="btn btn--green">
              Read the Kenya Pilot
            </Link>
          </div>
          <div className="pilot-strip__meta">
            <div className="pilot-strip__stat">
              <span className="pilot-strip__stat-value">29</span>
              <span className="pilot-strip__stat-label">April 2026</span>
            </div>
            <div className="pilot-strip__stat">
              <span className="pilot-strip__stat-value">PCPB</span>
              <span className="pilot-strip__stat-label">Host · Nairobi</span>
            </div>
            <div className="pilot-strip__stat">
              <span className="pilot-strip__stat-value">3</span>
              <span className="pilot-strip__stat-label">Domains validated</span>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        kicker="Methodology"
        title="Understand how a country's biological crop protection environment is measured"
        caption="Stakeholder ratings of importance and performance are combined into a weighted, comparable country-level index."
        buttonText="Read the Methodology"
        buttonTo="/methodology"
      />
    </>
  );
}
