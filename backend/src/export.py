import json
from pathlib import Path

import pandas as pd


# ---------------------------------------------------------
# African country codes used by the frontend map
# ---------------------------------------------------------

COUNTRY_CODES = {
    "Algeria": "DZA",
    "Angola": "AGO",
    "Benin": "BEN",
    "Botswana": "BWA",
    "Burkina Faso": "BFA",
    "Burundi": "BDI",
    "Cabo Verde": "CPV",
    "Cameroon": "CMR",
    "Central African Republic": "CAF",
    "Chad": "TCD",
    "Comoros": "COM",
    "Republic of the Congo": "COG",
    "Democratic Republic of the Congo": "COD",
    "Côte d'Ivoire": "CIV",
    "Djibouti": "DJI",
    "Egypt": "EGY",
    "Equatorial Guinea": "GNQ",
    "Eritrea": "ERI",
    "Eswatini": "SWZ",
    "Ethiopia": "ETH",
    "Gabon": "GAB",
    "The Gambia": "GMB",
    "Ghana": "GHA",
    "Guinea": "GIN",
    "Guinea-Bissau": "GNB",
    "Kenya": "KEN",
    "Lesotho": "LSO",
    "Liberia": "LBR",
    "Libya": "LBY",
    "Madagascar": "MDG",
    "Malawi": "MWI",
    "Mali": "MLI",
    "Mauritania": "MRT",
    "Mauritius": "MUS",
    "Morocco": "MAR",
    "Mozambique": "MOZ",
    "Namibia": "NAM",
    "Niger": "NER",
    "Nigeria": "NGA",
    "Rwanda": "RWA",
    "São Tomé and Príncipe": "STP",
    "Senegal": "SEN",
    "Seychelles": "SYC",
    "Sierra Leone": "SLE",
    "Somalia": "SOM",
    "South Africa": "ZAF",
    "South Sudan": "SSD",
    "Sudan": "SDN",
    "Tanzania": "TZA",
    "Togo": "TGO",
    "Tunisia": "TUN",
    "Uganda": "UGA",
    "Zambia": "ZMB",
    "Zimbabwe": "ZWE",
    "Western Sahara": "ESH",
}


def get_country_code(
    country: str,
) -> str | None:
    """
    Return the ISO-style alpha-3 country code used
    by the frontend Africa map.

    Countries not included in the mapping return None.
    """

    return COUNTRY_CODES.get(country)


def build_country_summary(
    scoring_results: dict,
    assessment_year: int | None = None,
) -> list[dict]:
    """
    Build lightweight country summary records.

    Intended for:
    - overall country rankings
    - dashboard comparison
    - country selector
    - Africa assessment-status map
    """

    summaries = []

    for country, result in scoring_results.items():
        eligibility = result["eligibility"]
        overall_index = result["overall_index"]

        record = {
            "country": country,
            "country_code": get_country_code(
                country
            ),
            "assessment_year": assessment_year,
            "status": eligibility["status"],
            "eligible_for_index": eligibility[
                "eligible_for_index"
            ],
            "respondent_count": eligibility[
                "respondent_count"
            ],
            "minimum_required": eligibility[
                "minimum_required"
            ],
        }

        if overall_index is None:
            record["overall_score_1_to_5"] = None
            record["overall_percentage"] = None
            record["message"] = eligibility["message"]

        else:
            record["overall_score_1_to_5"] = (
                overall_index["score_1_to_5"]
            )
            record["overall_percentage"] = (
                overall_index["percentage"]
            )
            record["message"] = None

        summaries.append(record)

    # Eligible countries first, ranked by score.
    summaries.sort(
        key=lambda item: (
            item["overall_percentage"] is None,
            -item["overall_percentage"]
            if item["overall_percentage"] is not None
            else 0,
        )
    )

    # Add ranking only to scored countries.
    rank = 1

    for record in summaries:
        if record["overall_percentage"] is not None:
            record["rank"] = rank
            rank += 1
        else:
            record["rank"] = None

    return summaries


def build_country_details(
    scoring_results: dict,
    assessment_year: int | None = None,
) -> dict:
    """
    Build the detailed country records used by the
    country-specific dashboard view.

    Public-facing detail is intentionally limited to:
    - country identity
    - overall score
    - respondent count
    - assessment year
    - three domain scores
    - eligibility status
    """

    country_details = {}

    for country, result in scoring_results.items():
        eligibility = result["eligibility"]

        detail = {
            "country": country,
            "country_code": get_country_code(
                country
            ),
            "assessment_year": assessment_year,
            "status": eligibility["status"],
            "eligible_for_index": eligibility[
                "eligible_for_index"
            ],
            "respondent_count": eligibility[
                "respondent_count"
            ],
            "minimum_required": eligibility[
                "minimum_required"
            ],
            "stakeholder_groups": eligibility[
                "stakeholder_groups"
            ],
            "group_counts": eligibility[
                "group_counts"
            ],
        }

        if not eligibility["eligible_for_index"]:
            detail["overall_score_1_to_5"] = None
            detail["overall_percentage"] = None
            detail["domains"] = None
            detail["message"] = eligibility["message"]

            country_details[country] = detail
            continue

        overall_index = result["overall_index"]
        domain_scores = result["domain_scores"]

        detail["overall_score_1_to_5"] = (
            overall_index["score_1_to_5"]
        )

        detail["overall_percentage"] = (
            overall_index["percentage"]
        )

        detail["message"] = None

        detail["domains"] = [
            {
                "domain_id": row["domain_id"],
                "domain_name": row["domain_name"],
                "score_1_to_5": row[
                    "score_1_to_5"
                ],
                "percentage": row[
                    "percentage"
                ],
            }
            for _, row in domain_scores.iterrows()
        ]

        country_details[country] = detail

    return country_details


def convert_to_json_safe(value):
    """
    Convert common pandas / NumPy values into native
    Python values that json.dump can serialize.
    """

    if isinstance(value, pd.DataFrame):
        return value.to_dict(
            orient="records"
        )

    if isinstance(value, pd.Series):
        return value.to_dict()

    if hasattr(value, "item"):
        try:
            return value.item()
        except (ValueError, AttributeError):
            pass

    return value


def save_json(
    data,
    output_path: str | Path,
) -> None:
    """
    Save a Python structure as formatted JSON.
    """

    path = Path(output_path)

    path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with path.open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            data,
            file,
            indent=2,
            ensure_ascii=False,
            default=convert_to_json_safe,
        )


def export_dashboard_data(
    scoring_results: dict,
    output_directory: str | Path,
    assessment_year: int | None = None,
) -> None:
    """
    Generate the two frontend-facing BioCOPPA files:

    1. country_summary.json
    2. country_details.json
    """

    output_directory = Path(
        output_directory
    )

    country_summary = build_country_summary(
        scoring_results=scoring_results,
        assessment_year=assessment_year,
    )

    country_details = build_country_details(
        scoring_results=scoring_results,
        assessment_year=assessment_year,
    )

    save_json(
        country_summary,
        output_directory
        / "country_summary.json",
    )

    save_json(
        country_details,
        output_directory
        / "country_details.json",
    )

    print(
        "Dashboard data exported successfully."
    )

    print(
        f"Summary: "
        f"{output_directory / 'country_summary.json'}"
    )

    print(
        f"Details: "
        f"{output_directory / 'country_details.json'}"
    )