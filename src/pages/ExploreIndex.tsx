import { useEffect, useState } from 'react';
import { AfricaMap } from '../components/charts/AfricaMap';
import { ResultsExplorer } from "../components/results/ResultsExplorer";

import {
  loadBioCoppaIndexData,
  type BioCoppaIndexData,
  type CountryDetail,
} from '../data/indexData';

export function ExploreIndex() {
  const [data, setData] = useState<BioCoppaIndexData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const result = await loadBioCoppaIndexData();

        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load BioCOPPA Index data.',
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="explore-index">
        <div className="container">
          <p>Loading BioCOPPA Index data...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="explore-index">
        <div className="container">
          <h1>Explore the BioCOPPA Index</h1>
          <p>The Index data could not be loaded.</p>

          {error && (
            <p className="explore-index__error">
              {error}
            </p>
          )}
        </div>
      </main>
    );
  }

  const getDomainScore = (
    detail: CountryDetail | undefined,
    domainId: 'research' | 'industry' | 'policy',
  ) => {
    if (!detail?.domains) return null;

    return (
      detail.domains.find(
        (domain) => domain.domain_id === domainId,
      )?.score_1_to_5 ?? null
    );
  };

  return (
    <main className="explore-index">

      <section className="explore-index__hero">
        <div className="container">

          <div className="explore-index__heading">
            <p className="explore-index__kicker">
              Explore the Index
            </p>

            <h1>
              Explore the BioCOPPA Index
            </h1>

            <p className="explore-index__lead">
              Explore country performance and assessment coverage
              across the enabling environment for biological crop
              protection products.
            </p>
          </div>

          <div className="explore-index__hero-grid">

            {/* LEFT SIDE — OVERALL INDEX TABLE */}
            <div className="explore-index__table-panel">

              <div className="explore-index__panel-heading">
                <p>Country Overview</p>

                <h2>
                  Overall Index Overview
                </h2>
              </div>

              <div className="explore-table-wrap">

                <div className="explore-table">

                  <div className="explore-table__row explore-table__row--head">
                    <div>Country</div>
                    <div>R&amp;D</div>
                    <div>Industry</div>
                    <div>Policy &amp; Regulatory</div>
                    <div>Overall Index</div>
                    <div>Percentage</div>
                  </div>

                  {data.summary.map((country) => {
                    const detail =
                      data.details[country.country];

                    const researchScore =
                      getDomainScore(
                        detail,
                        'research',
                      );

                    const industryScore =
                      getDomainScore(
                        detail,
                        'industry',
                      );

                    const policyScore =
                      getDomainScore(
                        detail,
                        'policy',
                      );

                    return (
                      <div
                        className={`explore-table__row ${
                          !country.eligible_for_index
                            ? 'explore-table__row--pending'
                            : ''
                        }`}
                        key={country.country_code}
                      >
                        <div className="explore-table__country">
                          <strong>
                            {country.country}
                          </strong>

                          <span>
                            {country.eligible_for_index
                              ? 'Index score available'
                              : 'Assessment in progress'}
                          </span>
                        </div>

                        <div>
                          {researchScore !== null
                            ? researchScore.toFixed(2)
                            : '—'}
                        </div>

                        <div>
                          {industryScore !== null
                            ? industryScore.toFixed(2)
                            : '—'}
                        </div>

                        <div>
                          {policyScore !== null
                            ? policyScore.toFixed(2)
                            : '—'}
                        </div>

                        <div className="explore-table__overall">
                          {country.overall_score_1_to_5 !== null
                            ? country.overall_score_1_to_5.toFixed(2)
                            : 'Pending'}
                        </div>

                        <div className="explore-table__percentage">
                          {country.overall_percentage !== null
                            ? `${country.overall_percentage.toFixed(1)}%`
                            : '—'}
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>

              <p className="explore-table__note">
                Domain and overall Index scores are shown on a
                1–5 scale. Percentage scores are shown on a
                0–100 scale.
              </p>

            </div>

            {/* RIGHT SIDE — MAP COMES NEXT */}
            <div className="explore-index__map-panel">
              <p className="explore-index__panel-label">
                Assessment Coverage
              </p>

              <h2>
                Africa Assessment Map
              </h2>

              <AfricaMap />
            </div>

          </div>
        </div>
      </section>

      <ResultsExplorer />

    </main>
  );
}