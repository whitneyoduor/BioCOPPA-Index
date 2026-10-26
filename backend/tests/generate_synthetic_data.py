from pathlib import Path

import pandas as pd


OUTPUT_FILE = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "raw"
    / "synthetic_kobo_export.xlsx"
)


STAKEHOLDER_GROUPS = [
    "Regulator",
    "Policy Actor",
    "Research & Academia",
    "Farmer",
    "Industry Player",
    "NGO / Development Organisation",
    "Value-Chain Actor",
]


# Six indicators are enough to test all three domains.
#
# Research: ind1, ind2
# Industry: ind25, ind26
# Policy: ind53, ind54
INDICATORS = [
    "ind1",
    "ind2",
    "ind25",
    "ind26",
    "ind53",
    "ind54",
]


def clamp_rating(value: int) -> int:
    """
    Keep a synthetic rating within the valid
    BioCOPPA 1-5 scale.
    """

    return max(1, min(5, value))


def create_respondent(
    country: str,
    stakeholder: str,
    respondent_number: int,
    assessment_year: int,
) -> dict:
    """
    Create one synthetic Kobo-style respondent record.
    """

    record = {
        "Country": country,
        "Stakeholder_category": stakeholder,
        "Years_of_experience_biopesticide_sector": "Above 3 years",
        "Assessment_year": assessment_year,
    }

    # Small controlled variation between respondents.
    variation = [-1, 0, 0, 0, 1][
        respondent_number % 5
    ]

    for indicator in INDICATORS:

        # Importance stays relatively high.
        importance_base = {
            "ind1": 5,
            "ind2": 4,
            "ind25": 5,
            "ind26": 4,
            "ind53": 5,
            "ind54": 4,
        }[indicator]

        # Kenya is intentionally given stronger
        # performance for testing purposes.
        if country == "Kenya":
            performance_base = {
                "ind1": 4,
                "ind2": 4,
                "ind25": 3,
                "ind26": 4,
                "ind53": 4,
                "ind54": 3,
            }[indicator]

        else:
            performance_base = {
                "ind1": 3,
                "ind2": 3,
                "ind25": 2,
                "ind26": 3,
                "ind53": 3,
                "ind54": 2,
            }[indicator]

        record[f"{indicator}_Importance"] = (
            clamp_rating(
                importance_base + variation
            )
        )

        record[f"{indicator}_Performance"] = (
            clamp_rating(
                performance_base + variation
            )
        )

    return record


def build_synthetic_dataset() -> pd.DataFrame:
    """
    Create synthetic BioCOPPA data.

    Kenya:
        7 stakeholder groups × 10 respondents
        = 70 respondents
        = eligible

    Uganda:
        six groups × 10 respondents
        + one group × 7 respondents
        = 67 respondents
        = insufficient sample
    """

    records = []

    # -----------------------------------------------------
    # Kenya — valid balanced sample
    # -----------------------------------------------------

    for stakeholder in STAKEHOLDER_GROUPS:

        for respondent_number in range(10):

            records.append(
                create_respondent(
                    country="Kenya",
                    stakeholder=stakeholder,
                    respondent_number=respondent_number,
                    assessment_year=2026,
                )
            )

    # -----------------------------------------------------
    # Uganda — intentionally insufficient sample
    # -----------------------------------------------------

    for stakeholder in STAKEHOLDER_GROUPS:

        if stakeholder == "Value-Chain Actor":
            respondent_total = 7
        else:
            respondent_total = 10

        for respondent_number in range(
            respondent_total
        ):

            records.append(
                create_respondent(
                    country="Uganda",
                    stakeholder=stakeholder,
                    respondent_number=respondent_number,
                    assessment_year=2026,
                )
            )

    return pd.DataFrame(records)


def main() -> None:
    """Generate and save the synthetic Kobo export."""

    df = build_synthetic_dataset()

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    df.to_excel(
        OUTPUT_FILE,
        index=False,
    )

    print("Synthetic BioCOPPA dataset created.")
    print(f"File: {OUTPUT_FILE}")
    print(f"Total respondents: {len(df)}")

    print("\nRespondents by country:")
    print(
        df["Country"].value_counts()
    )

    print("\nRespondents by country and stakeholder:")
    print(
        df.groupby(
            [
                "Country",
                "Stakeholder_category",
            ]
        )
        .size()
    )


if __name__ == "__main__":
    main()