import { useEffect, useMemo, useState } from "react";

type DomainResult = {
  domain_id: string;
  domain_name: string;
  score_1_to_5: number;
  percentage: number;
};

type CountryResult = {
  country: string;
  country_code: string;
  assessment_year: number;
  status: string;
  eligible_for_index: boolean;
  respondent_count: number;
  minimum_required: number;
  stakeholder_groups: number;
  group_counts: Record<string, number>;
  overall_score_1_to_5: number | null;
  overall_percentage: number | null;
  domains: DomainResult[] | null;
  message: string | null;
};

type CountryDetails = Record<string, CountryResult>;

export function ResultsExplorer() {
  const [countryData, setCountryData] = useState<CountryDetails>({});
  const [selectedCountry, setSelectedCountry] = useState("Kenya");
  const [viewBy, setViewBy] = useState("domain");

  useEffect(() => {
    fetch("/data/country_details.json")
      .then((response) => response.json())
      .then((data: CountryDetails) => {
        setCountryData(data);
      })
      .catch((error) => {
        console.error("Failed to load country details:", error);
      });
  }, []);

  const countryNames = useMemo(
    () => Object.keys(countryData),
    [countryData]
  );

  const eligibleCountries = useMemo(
    () =>
      Object.values(countryData).filter(
        (country) =>
          country.eligible_for_index &&
          country.overall_score_1_to_5 !== null
      ),
    [countryData]
  );

  const peerAverage =
    eligibleCountries.length >= 2
      ? eligibleCountries.reduce(
          (total, country) => total + (country.overall_score_1_to_5 ?? 0),
          0
        ) / eligibleCountries.length
      : null;

  const selected = countryData[selectedCountry];

  const getDomain = (domainId: string) =>
    selected?.domains?.find((domain) => domain.domain_id === domainId);

  const research = getDomain("research");
  const industry = getDomain("industry");
  const policy = getDomain("policy");

  const domainInsights = useMemo(() => {
    if (!selected?.domains || selected.domains.length === 0) {
      return null;
    }

    const sortedDomains = [...selected.domains].sort(
      (a, b) => b.score_1_to_5 - a.score_1_to_5
    );

    return {
      strongest: sortedDomains[0],
      weakest: sortedDomains[sortedDomains.length - 1],
    };
  }, [selected]);

  const handleReset = () => {
    setSelectedCountry("Kenya");
    setViewBy("domain");
  };

  const handleDownloadSummary = () => {
    if (!selected) return;

    const lines = [
      "BioCOPPA Index — Country Summary",
      "================================",
      "",
      `Country: ${selected.country}`,
      `Assessment Year: ${selected.assessment_year}`,
      `Respondents: ${selected.respondent_count}`,
      `Minimum Required: ${selected.minimum_required}`,
      `Stakeholder Groups: ${selected.stakeholder_groups}`,
      `Assessment Status: ${
        selected.eligible_for_index ? "Eligible" : "Insufficient sample"
      }`,
      "",
    ];

    if (
      selected.eligible_for_index &&
      selected.overall_score_1_to_5 !== null
    ) {
      lines.push(
        `Overall Index Score: ${selected.overall_score_1_to_5.toFixed(2)} / 5`,
        `Overall Percentage: ${selected.overall_percentage?.toFixed(1)}%`,
        "",
        "Domain Performance",
        "------------------"
      );

      selected.domains?.forEach((domain) => {
        lines.push(
          `${domain.domain_name}: ${domain.score_1_to_5.toFixed(
            2
          )} / 5 (${domain.percentage.toFixed(1)}%)`
        );
      });
    } else {
      lines.push(
        "Index Score: Not available",
        "",
        selected.message ?? "Assessment requirements have not yet been met."
      );
    }

    const file = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `BioCOPPA_${selected.country}_Summary_${selected.assessment_year}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <section className="results-explorer">
      <div className="results-explorer__header">
        <p className="results-explorer__eyebrow">
          Explore BioCOPPA Results
        </p>

        <h2>BioCOPPA Results Explorer</h2>

        <p className="results-explorer__intro">
          Explore country performance across BioCOPPA domains and assessment results.
        </p>
      </div>

      <div className="results-explorer__filters">
        <div className="results-explorer__filter">
          <label htmlFor="country-filter">Filter by Country</label>

          <select
            id="country-filter"
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
          >
            {countryNames.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="results-explorer__filter">
          <label htmlFor="view-filter">View by</label>

          <select
            id="view-filter"
            value={viewBy}
            onChange={(event) => setViewBy(event.target.value)}
          >
            <option value="domain">Domain</option>
          </select>
        </div>

        <button
          type="button"
          className="results-explorer__reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {selected && (
        <div className="results-explorer__metrics">
          <div className="results-explorer__metric">
            <span className="results-explorer__metric-label">
              Overall Index Score
            </span>
            <strong>
              {selected.overall_score_1_to_5 !== null
                ? selected.overall_score_1_to_5.toFixed(2)
                : "—"}
            </strong>
            <small>
              {selected.overall_percentage !== null
                ? `${selected.overall_percentage.toFixed(1)}% readiness`
                : "Score not available"}
            </small>
          </div>

          <div className="results-explorer__metric">
            <span className="results-explorer__metric-label">
              R&amp;D Domain Score
            </span>
            <strong>
              {research ? research.score_1_to_5.toFixed(2) : "—"}
            </strong>
            <small>
              {research ? `${research.percentage.toFixed(1)}%` : "Not available"}
            </small>
          </div>

          <div className="results-explorer__metric">
            <span className="results-explorer__metric-label">
              Industry Domain Score
            </span>
            <strong>
              {industry ? industry.score_1_to_5.toFixed(2) : "—"}
            </strong>
            <small>
              {industry ? `${industry.percentage.toFixed(1)}%` : "Not available"}
            </small>
          </div>

          <div className="results-explorer__metric">
            <span className="results-explorer__metric-label">
              Policy &amp; Regulatory Score
            </span>
            <strong>
              {policy ? policy.score_1_to_5.toFixed(2) : "—"}
            </strong>
            <small>
              {policy ? `${policy.percentage.toFixed(1)}%` : "Not available"}
            </small>
          </div>

          <div className="results-explorer__metric">
            <span className="results-explorer__metric-label">
              Respondents
            </span>
            <strong>{selected.respondent_count}</strong>
            <small>
              {selected.stakeholder_groups} stakeholder groups
            </small>
          </div>

          <div className="results-explorer__metric">
            <span className="results-explorer__metric-label">
              Assessment Status
            </span>
            <strong>
              {selected.eligible_for_index ? "Complete" : "Insufficient sample"}
            </strong>
            <small>
              {selected.eligible_for_index
                ? "Eligible for Index"
                : `${selected.respondent_count} of ${selected.minimum_required} required`}
            </small>
          </div>

        </div>
      )}

      {selected && (
        <div className="results-explorer__peer">
          <div className="results-explorer__peer-header">
            <span className="results-explorer__metric-label">
              Peer Comparison
            </span>

            <p>Overall Index Score (1–5)</p>
          </div>

          {selected.eligible_for_index &&
          selected.overall_score_1_to_5 !== null ? (
            peerAverage !== null ? (
              <div className="results-explorer__peer-content">
                <div className="results-explorer__peer-row">
                  <span>{selected.country}</span>

                  <div className="results-explorer__peer-bar">
                    <span
                      className="results-explorer__peer-fill results-explorer__peer-fill--country"
                      style={{
                        width: `${
                          (selected.overall_score_1_to_5 / 5) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <strong>
                    {selected.overall_score_1_to_5.toFixed(2)}
                  </strong>
                </div>

                <div className="results-explorer__peer-row">
                  <span>Peer Average</span>

                  <div className="results-explorer__peer-bar">
                    <span
                      className="results-explorer__peer-fill results-explorer__peer-fill--average"
                      style={{
                        width: `${(peerAverage / 5) * 100}%`,
                      }}
                    />
                  </div>

                  <strong>{peerAverage.toFixed(2)}</strong>
                </div>

                <small>
                  Average of countries currently eligible for the BioCOPPA Index.
                </small>
              </div>
            ) : (
              <div className="results-explorer__peer-empty">
                <strong>Country benchmark not yet available</strong>

                <p>
                  More eligible country assessments are required before a
                  peer comparison can be calculated.
                </p>
              </div>
            )
          ) : (
            <div className="results-explorer__peer-empty">
              <strong>Comparison unavailable</strong>

              <p>
                This country must first meet the minimum assessment
                requirements before it can be included in peer comparisons.
              </p>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="results-explorer__insight">
          <div className="results-explorer__insight-label">
            Key Insight
          </div>

          {selected.eligible_for_index && domainInsights ? (
            <div className="results-explorer__insight-content">
              <strong>
                {selected.country}'s strongest area is{" "}
                {domainInsights.strongest.domain_name}.
              </strong>

              <p>
                It records a score of{" "}
                <strong>
                  {domainInsights.strongest.score_1_to_5.toFixed(2)}
                </strong>{" "}
                out of 5 ({domainInsights.strongest.percentage.toFixed(1)}%).
                The lowest-performing domain is{" "}
                <strong>{domainInsights.weakest.domain_name}</strong>, with a
                score of{" "}
                <strong>
                  {domainInsights.weakest.score_1_to_5.toFixed(2)}
                </strong>{" "}
                out of 5 ({domainInsights.weakest.percentage.toFixed(1)}%).
              </p>
            </div>
          ) : (
            <div className="results-explorer__insight-content">
              <strong>Performance insight not yet available</strong>

              <p>
                Domain-level insights will be generated once this country meets
                the minimum requirements for a BioCOPPA Index score.
              </p>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="results-explorer__actions">
          <div>
            <strong>Country Summary</strong>
            <p>
              Download the current BioCOPPA assessment results for{" "}
              {selected.country}.
            </p>
          </div>

          <button
            type="button"
            className="results-explorer__download"
            onClick={handleDownloadSummary}
          >
            Download Summary
          </button>
        </div>
      )}

      {selected && !selected.eligible_for_index && selected.message && (
        <div className="results-explorer__message">
          {selected.message}
        </div>
      )}
    </section>
  );
}
