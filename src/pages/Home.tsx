import { useEffect, useRef, useState } from 'react';
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
            <Link to="/index" className="btn btn--gold">
              Explore the Index
            </Link>

            <Link to="/contribute" className="btn btn--outline-light">
              Contribute to the Index
            </Link>
          </div>
        </div>
      </section>

      <section className="glance-section">
        <div className="container">
           <div className="glance-section__header">
             <p className="glance-section__kicker">BioCOPPA at a glance</p>

             <p className="glance-section__intro">
              BioCOPPA assessments bring together perspectives from key stakeholder
              groups to build comparable country-level evidence.
             </p>
           </div>

           <div className="glance-grid">
             <GlanceCounter target={2} label="Countries Assessed" />
             <GlanceCounter target={7} label="Stakeholder Groups" />
             <GlanceCounter target={137} label="Participants" />
         </div>
        </div>
      </section>

      <section className="index-preview-section">
        <div className="container">
           <div className="index-preview-section__header">
            <p className="index-preview-section__kicker">Explore the Index</p>

            <h2 className="index-preview-section__title">
             See how countries are performing
            </h2>

            <p className="index-preview-section__intro">
             Compare the enabling environment for biological crop protection products
             across participating countries. Country scores are published once the
             minimum balanced respondent requirements have been met.
            </p>
           </div>

           <div className="index-table-wrap">
             <div className="index-table">
               <div className="index-table__row index-table__row--head">
                 <div>Country</div>
                 <div>R&amp;D</div>
                 <div>Industry</div>
                 <div>Policy &amp; Regulatory</div>
                 <div>Overall Index</div>
                 <div>Percentage</div>
               </div>

               <div className="index-table__row">
                 <div className="index-table__country">
                   <strong>Kenya</strong>
                   <span>Eligible</span>
                 </div>

                 <div className="index-table__score">4.00</div>
                 <div className="index-table__score">3.45</div>
                 <div className="index-table__score">3.55</div>

                 <div className="index-table__score index-table__score--overall">3.67</div>

                 <div className="index-table__score">73.3%</div>
               </div>

               <div className="index-table__row index-table__row--pending">
                 <div className="index-table__country">
                   <strong>Uganda</strong>
                   <span>Assessment in progress</span>
                 </div>

                 <div className="index-table__dash">—</div>
                 <div className="index-table__dash">—</div>
                 <div className="index-table__dash">—</div>
                 <div className="index-table__pending">Pending</div>
                 <div className="index-table__dash">—</div>
               </div>
             </div>
           </div>

               <div className="index-preview-section__footer">
                 <span className="index-preview-section__note">
                   Domain and overall index scores are shown on a 1–5 scale. Percentage scores are shown on a 0–100 scale.
                 </span>

                 <Link to="/index" className="index-preview-section__more">
                   <span>Explore the Full Index</span>
                   <span className="index-preview-section__arrow" aria-hidden="true">
                     ↓
                   </span>
                 </Link>
               </div>
           </div>
         </section>
      <section className="home-domains-section">
        <div className="container">
          <div className="home-domains-section__header">
            <p className="home-domains-section__kicker">What BioCOPPA Measures</p>

            <h2 className="home-domains-section__title">
              Three domains shape the BioCOPPA Index
            </h2>

            <p className="home-domains-section__intro">
              Together, the three domains provide a structured view of the research,
              market, policy, and regulatory conditions surrounding biological crop
              protection products.
            </p>
          </div>

          <div className="home-domains-grid">
            {DOMAIN_CONTENT.map((domain, index) => (
              <article className="home-domain-card" key={domain.id}>
                <span className="home-domain-card__number">0{index + 1}</span>

                <div className="home-domain-card__content">
                  <h3 className="home-domain-card__title">{domain.shortTitle}</h3>

                  <p className="home-domain-card__description">
                    {domain.short}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="home-domains-section__action">
            <Link to="/about" className="btn btn--gold">
              Learn More About the Index
            </Link>
          </div>
        </div>
      </section>

      <section className="home-value-section">
        <div className="container">
          <div className="home-value-section__header">
            <p className="home-value-section__kicker">Why BioCOPPA Matters</p>

            <h2 className="home-value-section__title">
              Turning stakeholder evidence into actionable insight
            </h2>

            <p className="home-value-section__intro">
              BioCOPPA helps decision-makers understand where enabling environments
              are strong, where gaps remain, and where targeted action can have the
              greatest impact.
            </p>
          </div>

          <div className="home-value-grid">
            <article className="home-value-card">
              <span className="home-value-card__number">01</span>

              <h3 className="home-value-card__title">Measure</h3>

              <p className="home-value-card__text">
                Assess the conditions shaping the development, access, and uptake of
                biological crop protection products.
              </p>
            </article>

            <article className="home-value-card">
              <span className="home-value-card__number">02</span>

              <h3 className="home-value-card__title">Compare</h3>

              <p className="home-value-card__text">
                Understand differences in enabling environments across countries and
                across the BioCOPPA domains.
              </p>
            </article>

            <article className="home-value-card">
              <span className="home-value-card__number">03</span>

              <h3 className="home-value-card__title">Act</h3>

              <p className="home-value-card__text">
                Identify priorities for policy reform, investment, capacity building,
                and collaboration.
              </p>
            </article>
          </div>

          <div className="home-value-section__action">
            <Link to="/about" className="btn btn--green">
              About the Index
            </Link>
          </div>
        </div>
      </section>

      <section className="home-resource-section">
        <div className="container home-resource-section__grid">
          <div className="home-resource-section__content">
            <p className="home-resource-section__kicker">Featured Resource</p>

            <h2 className="home-resource-section__title">
              Kenya Pilot 2026
            </h2>

            <p className="home-resource-section__text">
              The BioCOPPA Index was piloted in Kenya through a national stakeholder
              validation workshop hosted at the Pest Control Products Board in Nairobi
              on 29 April 2026.
            </p>

            <p className="home-resource-section__text">
              The pilot provided critical feedback on the framework, indicators,
              assessment criteria, and scoring approach, helping strengthen the
              BioCOPPA methodology for wider country application.
            </p>

            <Link to="/resources" className="btn btn--gold">
              Explore Resources
            </Link>
          </div>

          <div className="home-resource-section__meta">
            <div className="home-resource-stat">
              <strong>29</strong>
              <span>April 2026</span>
            </div>

            <div className="home-resource-stat">
              <strong>PCPB</strong>
              <span>Host · Nairobi</span>
            </div>

            <div className="home-resource-stat">
              <strong>3</strong>
              <span>Domains Validated</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
function GlanceCounter({
  target,
  label,
}: {
  target: number;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.4,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const nextValue = Math.round(progress * target);

      setCount(nextValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated, target]);

  return (
    <div className="glance-stat" ref={counterRef}>
      <strong className="glance-stat__value">{count}</strong>
      <span className="glance-stat__label">{label}</span>
    </div>
  );
}