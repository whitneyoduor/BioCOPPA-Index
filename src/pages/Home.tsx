import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAIN_CONTENT } from '../content/domains';

export function Home() {
  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="hero__kicker">Biological Crop Protection Products Access Index</p>
            <h1 className="hero__headline">
              Measuring the enabling environment for biological crop protection products
            </h1>
            <p className="hero__tagline">
              A biological crop protection products access research initiative.
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
        </div>
      </section>

      {/* 2. FLOATING STATS */}
            {/* 2. TYPOGRAPHIC STATS & INTRO */}
      <section className="home-intro-section">
        <div className="container home-intro-grid">
          
          <div className="home-intro-text">
            <p className="home-intro-kicker">BioCOPPA at a glance</p>
            <p className="home-intro-desc">
              BioCOPPA assessments bring together perspectives from key stakeholder 
              groups to build comparable country-level evidence.
            </p>
          </div>

          <div className="home-stats-grid">
            <GlanceCounter target={2} label="Countries Assessed" />
            <GlanceCounter target={7} label="Stakeholder Groups" />
            <GlanceCounter target={137} label="Participants" />
          </div>

        </div>
      </section>

      {/* 3. DATA PREVIEW TABLE */}
            {/* 3. DATA PREVIEW TABLE (Split Layout) */}
      <section className="index-preview-section">
        <div className="container index-split-layout">
           
           {/* Left Side: Text */}
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
            <div className="index-preview-section__footer">
               <Link to="/index" className="btn btn--green" style={{ marginTop: '1.5rem' }}>
                 Explore the Full Index →
               </Link>
            </div>
           </div>

           {/* Right Side: Table */}
           <div className="index-preview-section__table-area">
             <div className="index-table-wrap">
               <div className="index-table">
                 <div className="index-table__row index-table__row--head">
                   <div>Country</div>
                   <div>R&amp;D</div>
                   <div>Industry</div>
                   <div>Policy</div>
                   <div>Overall</div>
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
                 </div>

                 <div className="index-table__row index-table__row--pending">
                   <div className="index-table__country">
                     <strong>Uganda</strong>
                     <span>In progress</span>
                   </div>
                   <div className="index-table__dash">—</div>
                   <div className="index-table__dash">—</div>
                   <div className="index-table__dash">—</div>
                   <div className="index-table__pending">Pending</div>
                 </div>
               </div>
             </div>
             
             <p className="index-preview-section__note" style={{ marginTop: '15px', display: 'block' }}>
               Domain and overall scores are shown on a 1–5 scale.
             </p>
           </div>

        </div>
      </section>
      {/* 4. THREE DOMAINS */}
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
                  <p className="home-domain-card__description">{domain.short}</p>
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

            {/* 5. HOW IT WORKS (Horizontal Step Layout) */}
      <section className="home-value-section">
        <div className="container home-value-layout">
          
          {/* Left Side: Title & Intro */}
          <div className="home-value-header">
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

          {/* Right Side: The Steps */}
          <div className="home-value-steps">
            <article className="home-value-step">
              <span className="home-value-step__number">01</span>
              <div className="home-value-step__content">
                <h3 className="home-value-step__title">Measure</h3>
                <p className="home-value-step__text">
                  Assess the conditions shaping the development, access, and uptake of
                  biological crop protection products.
                </p>
              </div>
            </article>

            <article className="home-value-step">
              <span className="home-value-step__number">02</span>
              <div className="home-value-step__content">
                <h3 className="home-value-step__title">Compare</h3>
                <p className="home-value-step__text">
                  Understand differences in enabling environments across countries and
                  across the BioCOPPA domains.
                </p>
              </div>
            </article>

            <article className="home-value-step">
              <span className="home-value-step__number">03</span>
              <div className="home-value-step__content">
                <h3 className="home-value-step__title">Act</h3>
                <p className="home-value-step__text">
                  Identify priorities for policy reform, investment, capacity building,
                  and collaboration.
                </p>
              </div>
            </article>
          </div>

        </div>
      </section>
      {/* 6. KENYA PILOT SPLIT BLOCK */}
      <section className="home-resource-section">
        <div className="home-resource-grid">
          <div className="home-resource-content">
            <p className="home-resource-kicker">Featured Resource</p>
            <h2 className="home-resource-title">Kenya Pilot 2026</h2>
            <p className="home-resource-text">
              The BioCOPPA Index was piloted in Kenya through a national stakeholder
              validation workshop hosted at the Pest Control Products Board in Nairobi
              on 29 April 2026.
            </p>
            <p className="home-resource-text">
              The pilot provided critical feedback on the framework, indicators,
              assessment criteria, and scoring approach, helping strengthen the
              BioCOPPA methodology for wider country application.
            </p>
            <Link to="/resources" className="btn btn--gold">
              Explore the Kenya Pilot
            </Link>
          </div>
          <div className="home-resource-image">
            {/* Make sure you save the workshop image as kenya-pilot.jpg */}
            <img src="/images/kenya-pilot.png" alt="Kenya Pilot Workshop" />
          </div>
        </div>
      </section>
    </div>
  );
}

function GlanceCounter({ target, label }: { target: number; label: string; }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) setHasAnimated(true);
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
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