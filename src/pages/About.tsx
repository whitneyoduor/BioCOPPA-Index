import { Link } from 'react-router-dom';
import { PageHeader, Section } from '../components/Page';

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Stakeholder Assessment',
    text: 'Stakeholders from across the biological crop protection ecosystem provide assessments based on their knowledge and experience of the country context.',
  },
  {
    number: '02',
    title: 'Importance & Performance',
    text: 'Relevant factors are assessed according to their importance and the country’s current performance or status in those areas.',
  },
  {
    number: '03',
    title: 'Domain Scoring',
    text: 'The assessments are combined to generate scores across Research & Development, Industry Competitiveness, and Policy & Regulation.',
  },
  {
    number: '04',
    title: 'Country Index',
    text: 'The three domain results contribute to an overall country-level BioCOPPA score that can be interpreted and compared.',
  },
];

const REVEAL_ITEMS = [
  {
    number: '01',
    title: 'Overall Performance',
    text: 'Provide a country-level measure of the strength of the enabling environment for biological crop protection products.',
  },
  {
    number: '02',
    title: 'Domain Strengths',
    text: 'Show which of the three core domains are performing comparatively well within the country assessment.',
  },
  {
    number: '03',
    title: 'System Gaps',
    text: 'Highlight areas of the enabling environment where performance may be limiting development, access, or adoption.',
  },
  {
    number: '04',
    title: 'Priority Areas',
    text: 'Help stakeholders identify areas that may require policy attention, investment, capacity building, or institutional support.',
  },
  {
    number: '05',
    title: 'Change Over Time',
    text: 'Repeated assessments can help show how the enabling environment changes across assessment periods.',
  },
];

export function About() {
  return (
    <>
      {/* =====================================================
          HERO
          ===================================================== */}
      <PageHeader
        kicker="About the Index"
        title="About the BioCOPPA Index"
        intro="The BioCOPPA Index is a tool designed to assess the enabling environment for biological crop protection products (BCPPs), including biopesticides and biological control agents."
      />

      {/* =====================================================
          INTRODUCTION
          ===================================================== */}
      <Section className="section--white about-introduction">
        <div className="about-introduction__grid">
          <div className="about-introduction__statement">
            <span className="about-mini-label">A country-level assessment</span>
            <h2>
              Turning stakeholder knowledge into measurable evidence.
            </h2>
          </div>

          <div className="about-introduction__content">
            <p>
              The Index measures the extent to which a country&rsquo;s research,
              industry, policy, regulatory, institutional, and market systems
              support the development, registration, production, distribution,
              accessibility, and adoption of biological crop protection
              products.
            </p>

            <p>
              BioCOPPA combines stakeholder assessments of the{' '}
              <strong>importance</strong> of specific factors with assessments
              of the country&rsquo;s current <strong>performance</strong> or
              status in those areas. These assessments are used to produce a
              measurable country-level index.
            </p>
          </div>
        </div>
      </Section>

      {/* =====================================================
          WHY THE ENABLING ENVIRONMENT MATTERS
          ===================================================== */}
      <Section
        kicker="Why it matters"
        title="The Enabling Environment Matters"
        className="section--cream about-environment"
      >
        <div className="about-environment__grid">
          <div className="about-environment__lead">
            <p>
              Access to biological crop protection products depends on more
              than the availability of individual products.
            </p>
          </div>

          <div className="about-environment__content">
            <p>
              Their development, registration, production, distribution,
              accessibility, and adoption are influenced by the wider
              environment in which researchers, businesses, regulators,
              policymakers, farmers, and other stakeholders operate.
            </p>

            <p>
              Strong research systems can support innovation and evidence
              generation. Competitive industries can help move products from
              development into the market. Effective policies, regulations,
              and institutions can create clearer pathways for registration,
              investment, distribution, and use.
            </p>

            <p>
              BioCOPPA brings these interconnected conditions into a common
              framework, allowing countries to assess where their enabling
              environment is strong and where constraints may be limiting the
              growth and adoption of biological crop protection products.
            </p>
          </div>
        </div>
      </Section>

      {/* =====================================================
          THREE CORE DOMAINS
          ===================================================== */}
      <Section
        kicker="What the Index assesses"
        title="Three Core Domains"
        className="section--white about-domains-section"
      >
        <p className="section-head__intro">
          The BioCOPPA Index assesses the enabling environment through three
          core domains that together reflect the conditions influencing the
          development and accessibility of biological crop protection
          products.
        </p>

        <div className="about-domains">
          <article className="about-domain-card">
            <span className="about-domain-card__number">01</span>
            <h3>Research &amp; Development</h3>
            <p>
              Examines the research, innovation, technical capacity, knowledge
              generation, and supporting systems that contribute to the
              development of biological crop protection products.
            </p>
          </article>

          <article className="about-domain-card">
            <span className="about-domain-card__number">02</span>
            <h3>Industry Competitiveness</h3>
            <p>
              Examines the strength of the biological crop protection
              industry, including production, commercialisation, distribution,
              market development, and access.
            </p>
          </article>

          <article className="about-domain-card">
            <span className="about-domain-card__number">03</span>
            <h3>Policy &amp; Regulation</h3>
            <p>
              Examines the policy, regulatory, institutional, and governance
              environment supporting the registration, use, and growth of
              biological crop protection products.
            </p>
          </article>
        </div>
      </Section>

      {/* =====================================================
          PROCESS
          ===================================================== */}
      <Section
        kicker="How it works"
        title="From Stakeholder Assessment to Country Index"
        className="section--cream about-process-section"
      >
        <p className="section-head__intro">
          BioCOPPA follows a structured process that converts stakeholder
          assessments into comparable country-level evidence.
        </p>

        <div className="about-process">
          {PROCESS_STEPS.map((step, index) => (
            <article className="about-process__step" key={step.number}>
              <div className="about-process__top">
                <span className="about-process__number">{step.number}</span>

                {index < PROCESS_STEPS.length - 1 && (
                  <span
                    className="about-process__connector"
                    aria-hidden="true"
                  />
                )}
              </div>

              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* =====================================================
          SCORE
          ===================================================== */}
      <Section
        kicker="Reading the results"
        title="Understanding the BioCOPPA Score"
        className="section--white about-score-section"
      >
        <div className="about-score-layout">
          <div className="about-score-copy">
            <h3>
              A higher score reflects a stronger enabling environment.
            </h3>

            <p>
              The BioCOPPA score provides a common way of interpreting how
              supportive the assessed country environment is for biological
              crop protection products.
            </p>

            <p>
              Higher scores indicate stronger conditions across the areas
              assessed. Lower scores can point to areas where greater
              attention, investment, capacity building, policy reform,
              regulatory improvement, or institutional support may be needed.
            </p>
          </div>

          <div className="about-score-visual">
            <div className="about-score-visual__header">
              <span>Weaker enabling environment</span>
              <span>Stronger enabling environment</span>
            </div>

            <div className="about-score-scale" aria-label="BioCOPPA score scale">
              <div className="about-score-scale__segment">
                <strong>Emerging</strong>
              </div>
              <div className="about-score-scale__segment">
                <strong>Developing</strong>
              </div>
              <div className="about-score-scale__segment">
                <strong>Established</strong>
              </div>
              <div className="about-score-scale__segment">
                <strong>Advanced</strong>
              </div>
            </div>

            <div className="about-score-axis">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

            <p className="about-score-note">
              Scores are interpreted on a 0–100% scale to provide an accessible
              view of country performance.
            </p>
          </div>
        </div>
      </Section>

      {/* =====================================================
          WHAT THE INDEX CAN REVEAL
          ===================================================== */}
      <Section
        kicker="Using the evidence"
        title="What BioCOPPA Can Reveal"
        className="section--cream about-reveal-section"
      >
        <p className="section-head__intro">
          The Index is designed to move beyond a single headline score and
          provide a clearer picture of the strengths, constraints, and
          priorities within a country&rsquo;s enabling environment.
        </p>

        <div className="about-reveal-grid">
          {REVEAL_ITEMS.map((item) => (
            <article className="about-reveal-card" key={item.number}>
              <span className="about-reveal-card__number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* =====================================================
          COMMON FRAMEWORK
          ===================================================== */}
      <Section
        kicker="From evidence to action"
        title="A Common Framework for Action"
        className="section--white about-action-section"
      >
        <div className="about-action">
          <div className="about-action__main">
            <p>
              BioCOPPA provides a common, measurable framework for
              understanding whether a country&rsquo;s environment is
              sufficiently supportive of the development, registration,
              production, distribution, accessibility, and adoption of
              biological crop protection products.
            </p>

            <p>
              By identifying systemic strengths and gaps, the Index can help
              stakeholders determine where coordinated action may be most
              valuable.
            </p>
          </div>

          <div className="about-action__areas">
            <span>Policy reform</span>
            <span>Regulatory improvement</span>
            <span>Research investment</span>
            <span>Capacity building</span>
            <span>Institutional strengthening</span>
            <span>Stakeholder collaboration</span>
          </div>
        </div>
      </Section>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}
      <section className="about-cta">
        <div className="about-cta__inner">
          <div className="about-cta__copy">
            <span className="about-cta__kicker">Explore the evidence</span>

            <h2>See what the BioCOPPA Index reveals.</h2>

            <p>
              Explore country results across the three core domains or discover
              resources and insights from the development of the BioCOPPA Index.
            </p>
          </div>

          <div className="about-cta__actions">
            <Link
              to="/index"
              className="about-cta__button about-cta__button--primary"
            >
              Explore the Index
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              to="/resources"
              className="about-cta__button about-cta__button--secondary"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}