import re


# ---------------------------------------------------------------------
# BioCOPPA domain identifiers
# ---------------------------------------------------------------------

DOMAIN_RESEARCH = "research"
DOMAIN_INDUSTRY = "industry"
DOMAIN_POLICY = "policy"

BIOCOPPA_DOMAINS = [
    DOMAIN_RESEARCH,
    DOMAIN_INDUSTRY,
    DOMAIN_POLICY,
]


# ---------------------------------------------------------------------
# Current questionnaire structure
#
# These ranges reflect the current working version of the Kobo form.
# If the questionnaire structure changes, update this configuration
# rather than changing the scoring engine.
# ---------------------------------------------------------------------

DOMAIN_RANGES = {
    DOMAIN_RESEARCH: range(1, 25),
    DOMAIN_INDUSTRY: range(25, 53),
    DOMAIN_POLICY: range(53, 75),
}


DOMAIN_LABELS = {
    DOMAIN_RESEARCH: "Research & Development",
    DOMAIN_INDUSTRY: "Industry Competitiveness",
    DOMAIN_POLICY: "Policy, Regulatory Frameworks & Capacity",
}


def get_indicator_number(indicator_id: str) -> int:
    """
    Extract the numeric part of an indicator ID.

    Example:
        ind1  -> 1
        ind24 -> 24
    """

    match = re.search(r"\d+", indicator_id)

    if not match:
        raise ValueError(
            f"Unable to determine indicator number from: "
            f"{indicator_id}"
        )

    return int(match.group())


def get_indicator_domain(indicator_id: str) -> str:
    """
    Determine which BioCOPPA domain an indicator belongs to
    using the current questionnaire configuration.
    """

    indicator_number = get_indicator_number(
        indicator_id
    )

    for domain, indicator_range in DOMAIN_RANGES.items():

        if indicator_number in indicator_range:
            return domain

    raise ValueError(
        f"Indicator {indicator_id} is not assigned "
        f"to a BioCOPPA domain."
    )