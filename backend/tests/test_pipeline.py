from pathlib import Path
import json
import sys

# ---------------------------------------------------------
# Allow imports from backend/src
# ---------------------------------------------------------

BACKEND_SRC = (
    Path(__file__).resolve().parents[1]
    / "src"
)

sys.path.append(str(BACKEND_SRC))


from ingest import load_kobo_excel
from validate import (
    validate_dataset,
    assess_sample_eligibility,
)
from transform import responses_to_long_format
from scoring import compute_country_scores
from export import export_dashboard_data


# ---------------------------------------------------------
# File locations
# ---------------------------------------------------------

BACKEND_DIR = Path(__file__).resolve().parents[1]

DATA_FILE = (
    BACKEND_DIR
    / "data"
    / "raw"
    / "synthetic_kobo_export.xlsx"
)

OUTPUT_DIR = (
    BACKEND_DIR
    / "data"
    / "processed"
)


def main() -> None:

    # -----------------------------------------------------
    # STEP 1 — Load data
    # -----------------------------------------------------

    print("\nLoading synthetic BioCOPPA dataset...\n")

    df = load_kobo_excel(
        DATA_FILE
    )

    # -----------------------------------------------------
    # STEP 2 — Structural validation
    # -----------------------------------------------------

    print(
        "\nRunning structural validation...\n"
    )

    validate_dataset(df)

    # -----------------------------------------------------
    # STEP 3 — Sample eligibility
    # -----------------------------------------------------

    print(
        "\nAssessing country sample eligibility...\n"
    )

    eligibility_results = (
        assess_sample_eligibility(df)
    )

    for result in eligibility_results:

        print("-" * 60)

        print(
            f"Country: {result['country']}"
        )

        print(
            f"Status: {result['status']}"
        )

        print(
            f"Eligible for index: "
            f"{result['eligible_for_index']}"
        )

        print(
            f"Respondents: "
            f"{result['respondent_count']}"
        )

        print(
            f"Stakeholder groups: "
            f"{result['stakeholder_groups']}"
        )

        print(
            f"Group counts: "
            f"{result['group_counts']}"
        )

        print(
            f"Message: "
            f"{result['message']}"
        )

        if "reasons" in result:
            print(
                f"Reasons: "
                f"{result['reasons']}"
            )

    # -----------------------------------------------------
    # STEP 4 — Transform Kobo data
    # -----------------------------------------------------

    print(
        "\nTransforming Kobo responses "
        "to analytical long format...\n"
    )

    long_df = (
        responses_to_long_format(df)
    )

    print(
        f"Long-format rows: "
        f"{len(long_df)}"
    )

    print(
        f"Indicators detected: "
        f"{long_df['indicator'].nunique()}"
    )

    print(
        f"Countries detected: "
        f"{long_df['country'].nunique()}"
    )

    # -----------------------------------------------------
    # STEP 5 — Calculate BioCOPPA scores
    # -----------------------------------------------------

    print(
        "\nCalculating BioCOPPA scores...\n"
    )

    scoring_results = (
        compute_country_scores(
            raw_df=df,
            long_df=long_df,
        )
    )

    # -----------------------------------------------------
    # STEP 6 — Display results
    # -----------------------------------------------------

    for country, result in scoring_results.items():

        print("\n" + "=" * 60)

        print(
            f"BIOCOPPA RESULT — {country}"
        )

        print("=" * 60)

        eligibility = result[
            "eligibility"
        ]

        print(
            f"Status: "
            f"{eligibility['status']}"
        )

        print(
            f"Respondents: "
            f"{eligibility['respondent_count']}"
        )

        if not eligibility[
            "eligible_for_index"
        ]:

            print(
                "\nIndex score: "
                "NOT AVAILABLE"
            )

            print(
                eligibility["message"]
            )

            continue

        domain_scores = result[
            "domain_scores"
        ]

        overall_index = result[
            "overall_index"
        ]

        print(
            "\nDOMAIN PERFORMANCE"
        )

        print("-" * 60)

        for _, domain in (
            domain_scores.iterrows()
        ):

            print(
                f"{domain['domain_name']}: "
                f"{domain['score_1_to_5']}/5 "
                f"({domain['percentage']}%)"
            )

        print(
            "\nOVERALL BIOCOPPA INDEX"
        )

        print("-" * 60)

        print(
            f"Score: "
            f"{overall_index['score_1_to_5']}/5"
        )

        print(
            f"Percentage: "
            f"{overall_index['percentage']}%"
        )

    # -----------------------------------------------------
    # STEP 7 — Export frontend data
    # -----------------------------------------------------

    print(
        "\nExporting React-ready dashboard data...\n"
    )

    export_dashboard_data(
        scoring_results=scoring_results,
        output_directory=OUTPUT_DIR,
        assessment_year=2026,
    )

    # -----------------------------------------------------
    # STEP 8 — Verify frontend map-status contract
    # -----------------------------------------------------

    print(
        "\nVerifying frontend map-status contract...\n"
    )

    summary_file = (
        OUTPUT_DIR
        / "country_summary.json"
    )

    with summary_file.open(
        "r",
        encoding="utf-8",
    ) as file:
        country_summary = json.load(file)

    summary_by_country = {
        row["country"]: row
        for row in country_summary
    }

    # -----------------------------------------------------
    # Kenya — eligible / index score available
    # Expected frontend map colour: GREEN
    # -----------------------------------------------------

    assert "Kenya" in summary_by_country

    kenya = summary_by_country["Kenya"]

    assert kenya["status"] == "eligible"
    assert kenya["eligible_for_index"] is True
    assert kenya["overall_score_1_to_5"] is not None
    assert kenya["overall_percentage"] is not None

    print(
        "PASS — Kenya: "
        "index score available "
        "(map status: GREEN)"
    )

    # -----------------------------------------------------
    # Uganda — responses exist, but sample threshold
    # not yet satisfied
    # Expected frontend map colour: YELLOW
    # -----------------------------------------------------

    assert "Uganda" in summary_by_country

    uganda = summary_by_country["Uganda"]

    assert (
        uganda["status"]
        == "insufficient_sample"
    )

    assert (
        uganda["eligible_for_index"]
        is False
    )

    assert (
        uganda["overall_score_1_to_5"]
        is None
    )

    assert (
        uganda["overall_percentage"]
        is None
    )

    print(
        "PASS — Uganda: "
        "assessment in progress "
        "(map status: YELLOW)"
    )

    # -----------------------------------------------------
    # Tanzania — no responses in the synthetic dataset
    # It should therefore NOT appear in country_summary.json
    # Expected frontend map colour: GREY
    # -----------------------------------------------------

    assert "Tanzania" not in summary_by_country

    print(
        "PASS — Tanzania: "
        "no assessment data "
        "(map status: GREY)"
    )

    print(
        "\nAll frontend map-status "
        "contract tests passed."
    )

    print(
        "\nFull BioCOPPA pipeline test complete.\n"
    )


if __name__ == "__main__":
    main()