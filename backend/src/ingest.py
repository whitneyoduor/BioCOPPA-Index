from pathlib import Path

import pandas as pd


def load_kobo_excel(file_path: str) -> pd.DataFrame:
    """
    Load a KoboToolbox Excel export.

    Parameters
    ----------
    file_path : str
        Path to the Kobo Excel (.xlsx) file.

    Returns
    -------
    pd.DataFrame
        Raw Kobo submissions.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"Kobo export not found: {path}")

    if path.suffix.lower() != ".xlsx":
        raise ValueError("Expected a Kobo Excel file with the .xlsx extension.")

    df = pd.read_excel(path)

    print(f"Successfully loaded Kobo data.")
    print(f"Respondents: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    return df