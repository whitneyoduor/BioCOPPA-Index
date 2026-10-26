import pandas as pd


# ---------------------------------------------------------------------
# BioCOPPA configuration
# ---------------------------------------------------------------------

REQUIRED_COLUMNS = [
    "Country",
    "Stakeholder_category",
    "Years_of_experience_biopesticide_sector",
]

REQUIRED_STAKEHOLDER_GROUPS = 7
MIN_RESPONDENTS_PER_GROUP = 10

MIN_TOTAL_RESPONDENTS = (
    REQUIRED_STAKEHOLDER_GROUPS * MIN_RESPONDENTS_PER_GROUP
)


# ---------------------------------------------------------------------
# Structural validation
# ---------------------------------------------------------------------

def validate_required_columns(df: pd.DataFrame) -> None:
    """
    Confirm that the minimum BioCOPPA fields exist.
    """

    missing_columns = [
        column
        for column in REQUIRED_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )


def get_indicator_columns(
    df: pd.DataFrame,
) -> tuple[list[str], list[str]]:
    """
    Discover Importance and Performance fields dynamically.

    No assumption is made about the total number of indicators.
    """

    importance_columns = [
        column
        for column in df.columns
        if column.startswith("ind")
        and column.endswith("_Importance")
    ]

    performance_columns = [
        column
        for column in df.columns
        if column.startswith("ind")
        and column.endswith("_Performance")
    ]

    return importance_columns, performance_columns


def validate_indicator_columns(df: pd.DataFrame) -> None:
    """
    Ensure every discovered indicator has both an
    Importance and Performance field.
    """

    importance_columns, performance_columns = (
        get_indicator_columns(df)
    )

    importance_ids = {
        column.removesuffix("_Importance")
        for column in importance_columns
    }

    performance_ids = {
        column.removesuffix("_Performance")
        for column in performance_columns
    }

    missing_performance = (
        importance_ids - performance_ids
    )

    missing_importance = (
        performance_ids - importance_ids
    )

    if missing_performance:
        raise ValueError(
            "Indicators missing Performance fields: "
            f"{sorted(missing_performance)}"
        )

    if missing_importance:
        raise ValueError(
            "Indicators missing Importance fields: "
            f"{sorted(missing_importance)}"
        )

    if not importance_ids:
        raise ValueError(
            "No BioCOPPA indicator fields were found."
        )


def validate_no_missing_values(df: pd.DataFrame) -> None:
    """
    Reject incomplete analytical records.

    Kobo is expected to prevent incomplete questionnaire
    submissions, but the backend verifies completeness again.
    """

    importance_columns, performance_columns = (
        get_indicator_columns(df)
    )

    columns_to_check = (
        REQUIRED_COLUMNS
        + importance_columns
        + performance_columns
    )

    missing = {}

    for column in columns_to_check:

        if column not in df.columns:
            continue

        missing_count = int(
            df[column].isna().sum()
        )

        if missing_count > 0:
            missing[column] = missing_count

    if missing:
        raise ValueError(
            f"Missing values detected: {missing}"
        )


def validate_rating_ranges(df: pd.DataFrame) -> None:
    """
    Ensure all Importance and Performance ratings are
    numeric values between 1 and 5.
    """

    importance_columns, performance_columns = (
        get_indicator_columns(df)
    )

    rating_columns = (
        importance_columns
        + performance_columns
    )

    invalid = {}

    for column in rating_columns:

        numeric_values = pd.to_numeric(
            df[column],
            errors="coerce",
        )

        invalid_mask = (
            numeric_values.isna()
            | ~numeric_values.between(1, 5)
        )

        if invalid_mask.any():

            invalid[column] = (
                df.loc[
                    invalid_mask,
                    column,
                ]
                .tolist()
            )

    if invalid:
        raise ValueError(
            f"Invalid 1-5 ratings detected: {invalid}"
        )


def validate_dataset(df: pd.DataFrame) -> None:
    """
    Run structural BioCOPPA validation.

    This checks whether the dataset itself is valid.

    It DOES NOT determine whether a country has enough
    respondents to calculate an index. Sample eligibility
    is assessed separately.
    """

    validate_required_columns(df)

    validate_indicator_columns(df)

    validate_no_missing_values(df)

    validate_rating_ranges(df)

    importance_columns, _ = (
        get_indicator_columns(df)
    )

    print("BioCOPPA dataset validation passed.")

    print(
        f"Respondents in dataset: {len(df)}"
    )

    print(
        f"Indicators detected: "
        f"{len(importance_columns)}"
    )


# ---------------------------------------------------------------------
# Country sample eligibility
# ---------------------------------------------------------------------

def assess_country_sample(
    country_df: pd.DataFrame,
    country_name: str,
) -> dict:
    """
    Determine whether one country has a sufficiently
    balanced stakeholder sample to calculate a BioCOPPA Index.

    Requirements:
    - Exactly 7 stakeholder groups.
    - At least 10 respondents per stakeholder group.
    - Equal respondent counts across all stakeholder groups.

    An insufficient sample is NOT treated as invalid data.
    Instead, this function returns an eligibility status
    that can later be displayed by the frontend.
    """

    stakeholder_counts = (
        country_df[
            "Stakeholder_category"
        ]
        .value_counts()
        .sort_index()
    )

    total_respondents = len(country_df)

    number_of_groups = len(
        stakeholder_counts
    )

    # ---------------------------------------------------------
    # Check 1: all seven stakeholder categories represented
    # ---------------------------------------------------------

    has_all_groups = (
        number_of_groups
        == REQUIRED_STAKEHOLDER_GROUPS
    )

    # ---------------------------------------------------------
    # Check 2: every group has at least 10 respondents
    # ---------------------------------------------------------

    minimum_per_group_met = (
        has_all_groups
        and (
            stakeholder_counts
            >= MIN_RESPONDENTS_PER_GROUP
        ).all()
    )

    # ---------------------------------------------------------
    # Check 3: stakeholder groups are balanced
    # ---------------------------------------------------------

    balanced_groups = (
        has_all_groups
        and stakeholder_counts.nunique()
        == 1
    )

    # ---------------------------------------------------------
    # Final eligibility
    # ---------------------------------------------------------

    eligible = (
        has_all_groups
        and minimum_per_group_met
        and balanced_groups
    )

    if eligible:

        respondents_per_group = int(
            stakeholder_counts.iloc[0]
        )

        return {
            "country": country_name,
            "status": "eligible",
            "eligible_for_index": True,
            "respondent_count": (
                total_respondents
            ),
            "minimum_required": (
                MIN_TOTAL_RESPONDENTS
            ),
            "stakeholder_groups": (
                number_of_groups
            ),
            "respondents_per_group": (
                respondents_per_group
            ),
            "group_counts": (
                stakeholder_counts.to_dict()
            ),
            "message": (
                "Minimum respondent threshold "
                "and stakeholder balance "
                "requirements have been met."
            ),
        }

    # ---------------------------------------------------------
    # Country has not yet met requirements
    # ---------------------------------------------------------

    reasons = []

    if not has_all_groups:

        reasons.append(
            f"{number_of_groups} of "
            f"{REQUIRED_STAKEHOLDER_GROUPS} "
            "stakeholder groups represented"
        )

    if has_all_groups and not minimum_per_group_met:

        groups_below_minimum = (
            stakeholder_counts[
                stakeholder_counts
                < MIN_RESPONDENTS_PER_GROUP
            ]
            .to_dict()
        )

        reasons.append(
            "one or more stakeholder groups "
            "have fewer than "
            f"{MIN_RESPONDENTS_PER_GROUP} "
            f"respondents: "
            f"{groups_below_minimum}"
        )

    if has_all_groups and not balanced_groups:

        reasons.append(
            "stakeholder groups do not have "
            "equal respondent counts"
        )

    return {
        "country": country_name,
        "status": "insufficient_sample",
        "eligible_for_index": False,
        "respondent_count": (
            total_respondents
        ),
        "minimum_required": (
            MIN_TOTAL_RESPONDENTS
        ),
        "stakeholder_groups": (
            number_of_groups
        ),
        "respondents_per_group": None,
        "group_counts": (
            stakeholder_counts.to_dict()
        ),
        "message": (
            "Index score not yet available. "
            "This country has not met the "
            "minimum balanced respondent "
            "threshold required to calculate "
            "a BioCOPPA Index score."
        ),
        "reasons": reasons,
    }


def assess_sample_eligibility(
    df: pd.DataFrame,
) -> list[dict]:
    """
    Assess index eligibility for every country
    contained in the dataset.

    Returns one status record per country.
    """

    results = []

    for country, country_df in df.groupby(
        "Country"
    ):

        result = assess_country_sample(
            country_df=country_df,
            country_name=country,
        )

        results.append(result)

    return results


def get_eligible_countries(
    df: pd.DataFrame,
) -> list[str]:
    """
    Return only countries that currently satisfy
    the BioCOPPA sample requirements.
    """

    eligibility_results = (
        assess_sample_eligibility(df)
    )

    return [
        result["country"]
        for result in eligibility_results
        if result["eligible_for_index"]
    ]