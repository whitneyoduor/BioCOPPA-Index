export type CountryStatus =
  | 'eligible'
  | 'insufficient_sample';

export interface CountrySummary {
  country: string;
  country_code: string;
  assessment_year: number;
  status: CountryStatus;
  eligible_for_index: boolean;
  respondent_count: number;
  minimum_required: number;
  overall_score_1_to_5: number | null;
  overall_percentage: number | null;
  message: string | null;
  rank: number | null;
}

export interface CountryDomain {
  domain_id: 'research' | 'industry' | 'policy';
  domain_name: string;
  score_1_to_5: number;
  percentage: number;
}

export interface CountryDetail {
  country: string;
  country_code: string;
  assessment_year: number;
  status: CountryStatus;
  eligible_for_index: boolean;
  respondent_count: number;
  minimum_required: number;
  stakeholder_groups: number;
  group_counts: Record<string, number>;
  overall_score_1_to_5: number | null;
  overall_percentage: number | null;
  domains: CountryDomain[] | null;
  message: string | null;
}

export type CountryDetails =
  Record<string, CountryDetail>;

export interface BioCoppaIndexData {
  summary: CountrySummary[];
  details: CountryDetails;
}

export async function loadBioCoppaIndexData():
  Promise<BioCoppaIndexData> {

  const [
    summaryResponse,
    detailsResponse,
  ] = await Promise.all([
    fetch('/data/country_summary.json'),
    fetch('/data/country_details.json'),
  ]);

  if (!summaryResponse.ok) {
    throw new Error(
      `Could not load country summary: ${summaryResponse.status}`,
    );
  }

  if (!detailsResponse.ok) {
    throw new Error(
      `Could not load country details: ${detailsResponse.status}`,
    );
  }

  const summary =
    (await summaryResponse.json()) as CountrySummary[];

  const details =
    (await detailsResponse.json()) as CountryDetails;

  return {
    summary,
    details,
  };
}