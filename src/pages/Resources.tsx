import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PILOT_IMAGES = [
  {
    src: "/images/kenya-pilot/Screenshot (19).png",
    alt: "BioCOPPA Kenya Pilot",
  },
  {
    src: "/images/kenya-pilot/Screenshot (20).png",
    alt: "BioCOPPA Kenya Pilot stakeholder session",
  },
  {
    src: "/images/kenya-pilot/Screenshot (21).png",
    alt: "BioCOPPA Kenya Pilot discussion",
  },
  {
    src: "/images/kenya-pilot/Screenshot (22).png",
    alt: "BioCOPPA Kenya Pilot participants",
  },
];

export function Resources() {
  const [activeSlide, setActiveSlide] = useState(0);

  const previousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? PILOT_IMAGES.length - 1 : current - 1
    );
  };

  const nextSlide = () => {
    setActiveSlide((current) =>
      current === PILOT_IMAGES.length - 1 ? 0 : current + 1
    );
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) =>
        current === PILOT_IMAGES.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="resources-page">
      <section className="resources-hero">
        <div className="resources-hero__content">
          <span className="resources-hero__kicker">Resources</span>

          <h1>Resources &amp; Insights</h1>

          <p>
            Explore stories, insights and resources from the BioCOPPA Index.
          </p>

          <div className="resources-carousel">
            <div className="resources-carousel__frame">
              <img
                src={PILOT_IMAGES[activeSlide].src}
                alt={PILOT_IMAGES[activeSlide].alt}
              />

              <button
                type="button"
                className="resources-carousel__arrow resources-carousel__arrow--left"
                onClick={previousSlide}
                aria-label="Previous image"
              >
                &#8592;
              </button>

              <button
                type="button"
                className="resources-carousel__arrow resources-carousel__arrow--right"
                onClick={nextSlide}
                aria-label="Next image"
              >
                &#8594;
              </button>
            </div>

            <div
              className="resources-carousel__dots"
              aria-label="Carousel navigation"
            >
              {PILOT_IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={
                    index === activeSlide
                      ? "resources-carousel__dot resources-carousel__dot--active"
                      : "resources-carousel__dot"
                  }
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="resources-pilot">
        <div className="resources-pilot__inner">
          <div className="resources-pilot__intro">
            <span className="resources-pilot__kicker">Kenya Pilot</span>

            <h2>Piloting the BioCOPPA Index in Kenya</h2>

            <p>
              The BioCOPPA Index was piloted in Kenya on 29 April 2026 through a
              national stakeholder validation workshop held in Nairobi and hosted
              at the Pest Control Products Board (PCPB). The workshop brought
              together stakeholders from government agencies, research institutions,
              academia and the crop protection industry to assess the relevance,
              applicability and robustness of the BioCOPPA Index within Kenya's
              regulatory and institutional context.
            </p>
          </div>

          <div className="resources-pilot__insights">
            <h3>Key Insights from the Pilot</h3>

            <ul>
              <li>
                <strong>Growing interest in biologicals.</strong> Stakeholders
                recognised increasing national interest in biologicals and
                biopesticides as part of sustainable agriculture and integrated pest
                management.
              </li>

              <li>
                <strong>Regulatory pathways can be strengthened.</strong> Kenya has
                made regulatory progress, while stakeholders identified a need for
                clearer and more tailored pathways for biological product
                registration.
              </li>

              <li>
                <strong>Collaboration matters.</strong> Stronger coordination between
                regulators, research institutions, policy actors and industry was
                identified as important.
              </li>

              <li>
                <strong>Capacity building remains important.</strong> Stakeholders
                identified capacity needs in areas including risk assessment,
                evaluation and stewardship of biological products.
              </li>

              <li>
                <strong>Support for the Index.</strong> Participants saw BioCOPPA as
                a useful diagnostic and planning tool for identifying gaps and
                informing policy and regulatory improvements.
              </li>
            </ul>
          </div>

          <div className="resources-pilot__report">
            <div>
              <span className="resources-pilot__report-label">Pilot Report</span>
              <h3>BioCOPPA Index Pilot Report — Kenya</h3>
              <p>
                Read the full account of the stakeholder validation workshop,
                including its objectives, proceedings, key insights and next steps.
              </p>
            </div>

            <a
              className="resources-pilot__download"
              href="/BioCOPPA Index Pilot Report[80].pdf"
              target="_blank"
              rel="noreferrer"
            >
              Download Report
            </a>
          </div>
        </div>
      </section>

      <section className="resources-feedback">
        <div className="resources-feedback__inner">
          <span className="resources-feedback__kicker">Share Your Feedback</span>

          <h2>Help shape the BioCOPPA Index</h2>

          <p>
            The BioCOPPA Index is designed to evolve through stakeholder input.
            We welcome your feedback on the Index, its indicators, the way results
            are presented, and how the platform could be improved.
          </p>

          <Link
            to="/contribute"
            className="resources-feedback__button"
          >
            Share Your Feedback
          </Link>
        </div>
      </section>
    </main>
  );
}