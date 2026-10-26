import pandas as pd

from validate import assess_country_sample
from config import (
    BIOCOPPA_DOMAINS,
    DOMAIN_LABELS,
    get_indicator_domain,
)


def round_score(value: float, decimals: int = 2) -> float:
    """Round calculated BioCOPPA scores consistently."""
    return round(float(value), decimals)


def compute_stakeholder_group_means(
    long_df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Calculate mean Importance and Performance scores
    for each stakeholder category within each country
    and indicator.

    Each output row represents:
    country + indicator + stakeholder category.
    """

    group_means = (
        long_df
        .groupby(
            [
                "country",
                "indicator",
                "stakeholder_category",
            ],
            as_index=False,
        )
        .agg(
            mean_importance=(
                "importance",
                "mean",
            ),
            mean_performance=(
                "performance",
                "mean",
            ),
            respondent_count=(
                "respondent_id",
                "nunique",
            ),
        )
    )

    return group_means


def compute_balanced_indicator_scores(
    group_means: pd.DataFrame,
) -> pd.DataFrame:
    """
    Calculate balanced national Importance and Performance
    scores for every indicator.

    Each stakeholder category contributes equally because
    stakeholder-category means are averaged rather than
    averaging all respondents directly.
    """

    balanced_scores = (
        group_means
        .groupby(
            [
                "country",
                "indicator",
            ],
            as_index=False,
        )
        .agg(
            importance=(
                "mean_importance",
                "mean",
            ),
            performance=(
                "mean_performance",
                "mean",
            ),
            stakeholder_groups=(
                "stakeholder_category",
                "nunique",
            ),
            respondent_count=(
                "respondent_count",
                "sum",
            ),
        )
    )

    balanced_scores["importance"] = (
        balanced_scores["importance"].round(2)
    )

    balanced_scores["performance"] = (
        balanced_scores["performance"].round(2)
    )

    return balanced_scores


def add_indicator_calculations(
    indicator_scores: pd.DataFrame,
) -> pd.DataFrame:
    """
    Add domain membership and weighted indicator scores.

    Weighted Indicator Score =
        Importance × Performance
    """

    scores = indicator_scores.copy()

    scores["domain"] = (
        scores["indicator"]
        .apply(get_indicator_domain)
    )

    scores["weighted_score"] = (
        scores["importance"]
        * scores["performance"]
    ).round(2)

    return scores


def compute_domain_scores(
    indicator_scores: pd.DataFrame,
) -> pd.DataFrame:
    """
    Calculate weighted BioCOPPA domain scores.

    Domain Score =
        Sum(Importance × Performance)
        --------------------------------
             Sum(Importance)

    The result remains on the 1-5 scale.
    """

    domain_results = []

    for domain_id in BIOCOPPA_DOMAINS:

        domain_df = indicator_scores[
            indicator_scores["domain"] == domain_id
        ]

        if domain_df.empty:
            raise ValueError(
                f"No indicators found for domain: {domain_id}"
            )

        total_importance = (
            domain_df["importance"].sum()
        )

        total_weighted_score = (
            domain_df["weighted_score"].sum()
        )

        if total_importance == 0:
            raise ValueError(
                f"Total importance is zero for domain: {domain_id}"
            )

        domain_score = (
            total_weighted_score
            / total_importance
        )

        domain_percentage = (
            domain_score / 5
        ) * 100

        domain_results.append(
            {
                "domain_id": domain_id,
                "domain_name": (
                    DOMAIN_LABELS[domain_id]
                ),
                "indicator_count": (
                    len(domain_df)
                ),
                "importance_sum": (
                    round_score(
                        total_importance
                    )
                ),
                "weighted_score_sum": (
                    round_score(
                        total_weighted_score
                    )
                ),
                "score_1_to_5": (
                    round_score(
                        domain_score
                    )
                ),
                "percentage": (
                    round_score(
                        domain_percentage,
                        1,
                    )
                ),
            }
        )

    return pd.DataFrame(domain_results)


def compute_overall_index(
    domain_scores: pd.DataFrame,
) -> dict:
    """
    Calculate the overall BioCOPPA Index.

    Overall BioCOPPA Score =
        Average of the three domain scores.

    The methodological score remains on the 1-5 scale.
    The public-facing score is expressed as a percentage.
    """

    if len(domain_scores) != 3:
        raise ValueError(
            "Overall BioCOPPA Index requires exactly "
            "three domain scores."
        )

    overall_score = (
        domain_scores["score_1_to_5"]
        .mean()
    )

    overall_percentage = (
        overall_score / 5
    ) * 100

    return {
        "score_1_to_5": round_score(
            overall_score
        ),
        "percentage": round_score(
            overall_percentage,
            1,
        ),
    }


def compute_country_scores(
    raw_df: pd.DataFrame,
    long_df: pd.DataFrame,
) -> dict:
    """
    Process every country in the dataset.

    Eligible countries receive:
    - balanced indicator scores
    - weighted indicator scores
    - three domain scores
    - overall BioCOPPA Index

    Countries that have not met the respondent threshold
    receive eligibility information only.
    """

    results = {}

    for country, country_raw_df in raw_df.groupby(
        "Country"
    ):

        eligibility = assess_country_sample(
            country_df=country_raw_df,
            country_name=country,
        )

        # -------------------------------------------------
        # Insufficient sample
        # -------------------------------------------------

        if not eligibility[
            "eligible_for_index"
        ]:

            results[country] = {
                "eligibility": eligibility,
                "indicator_scores": None,
                "domain_scores": None,
                "overall_index": None,
            }

            continue

        # -------------------------------------------------
        # Select transformed country records
        # -------------------------------------------------

        country_long_df = long_df[
            long_df["country"] == country
        ].copy()

        # -------------------------------------------------
        # Step 1:
        # Average within stakeholder categories
        # -------------------------------------------------

        stakeholder_means = (
            compute_stakeholder_group_means(
                country_long_df
            )
        )

        # -------------------------------------------------
        # Step 2:
        # Balance stakeholder categories nationally
        # -------------------------------------------------

        balanced_indicators = (
            compute_balanced_indicator_scores(
                stakeholder_means
            )
        )

        # -------------------------------------------------
        # Step 3:
        # Add domain and weighted score
        # -------------------------------------------------

        calculated_indicators = (
            add_indicator_calculations(
                balanced_indicators
            )
        )

        # -------------------------------------------------
        # Step 4:
        # Calculate the three domain scores
        # -------------------------------------------------

        domain_scores = (
            compute_domain_scores(
                calculated_indicators
            )
        )

        # -------------------------------------------------
        # Step 5:
        # Calculate overall BioCOPPA Index
        # -------------------------------------------------

        overall_index = (
            compute_overall_index(
                domain_scores
            )
        )

        results[country] = {
            "eligibility": eligibility,
            "indicator_scores": (
                calculated_indicators
            ),
            "domain_scores": (
                domain_scores
            ),
            "overall_index": (
                overall_index
            ),
        }

    return results