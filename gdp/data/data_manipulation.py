import os
import csv
import pandas as pd

MIN_YEAR = 1960
MAX_YEAR = 2021

years = list(range(MIN_YEAR, MAX_YEAR + 1))

co2_file_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "co2-emissions.csv"
)
co2_df = pd.read_csv(co2_file_path)

co2_df = co2_df[(co2_df["Year"] >= MIN_YEAR) & (pd.notna(co2_df["Code"]))]
country_codes = sorted(co2_df["Code"].unique())


def get_emissions(year: int, coutry_code: str):
    filtered_df = co2_df[(co2_df["Year"] == year) & (co2_df["Code"] == coutry_code)]

    if filtered_df.empty:
        return 0
    else:
        return filtered_df["Emissions"].iloc[0]


csv_header = ["Year", "Code", "Emissions"]
csv_output = []
for year in years:
    for country_code in country_codes:
        csv_output.append([year, country_code, get_emissions(year, country_code)])


output_file_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "co2-emissions-filtered.csv"
)

with open(output_file_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(csv_header)
    writer.writerows(csv_output)