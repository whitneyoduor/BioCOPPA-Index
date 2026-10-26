import re

import pandas as pd


INDICATOR_PATTERN = re.compile(
    r"^(ind\d+)_(Importance|Performance)$",
    re.IGNORECASE,
)


def discover_indicators(df: pd.DataFrame) -> list[str]:
    """
    Discover indicator IDs dynamically from Kobo column names.

    Example:
        ind1_Importance
        ind1_Performance

    becomes:
        ind1
    """

    indicators = set()

    for column in df.columns:
        match = INDICATOR_PATTERN.match(column)

        if match:
            indicators.add(match.group(1).lower())

    def indicator_number(indicator_id: str) -> int:
        return int(
            re.search(r"\d+", indicator_id).group()
        )

    return sorted(
        indicators,
        key=indicator_number,
    )


def responses_to_long_format(
    df: pd.DataFrame,
) -> pd.DataFrame:
    """
    Convert a wide Kobo export into one row per
    respondent-indicator combination.

    The function does not assume a fixed number of indicators.
    """

    indicators = discover_indicators(df)

    records = []

    for respondent_index, row in df.iterrows():

        for indicator_id in indicators:

            importance_column = f"{indicator_id}_Importance"
            performance_column = f"{indicator_id}_Performance"

            records.append(
                {
                    "respondent_id": respondent_index,
                    "country": row["Country"],
                    "stakeholder_category": row[
                        "Stakeholder_category"
                    ],
                    "experience": row[
                        "Years_of_experience_biopesticide_sector"
                    ],
                    "indicator": indicator_id,
                    "importance": float(
                        row[importance_column]
                    ),
                    "performance": float(
                        row[performance_column]
                    ),
                }
            )

    long_df = pd.DataFrame(records)

    return long_df