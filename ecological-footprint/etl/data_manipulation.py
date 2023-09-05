import json
import os
import urllib.request
import zipfile
import shutil
import pandas as pd


def save_file(data: json, file_name: str):
    full_file_name = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), file_name
    )
    with open(full_file_name, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


pop_url = "https://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv"
zip_temp_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "zip_temp")
os.mkdir(zip_temp_path)

population_zip_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "zip_temp/population.zip"
)
urllib.request.urlretrieve(pop_url, population_zip_path)

with zipfile.ZipFile(population_zip_path, 'r') as zip_f:
    zip_f.extractall(zip_temp_path)

pop_file_name = ""
for file_name in os.listdir(zip_temp_path):
    if file_name[:10] == "API_SP.POP":
        pop_file_name = file_name

pop_file_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "zip_temp/" + pop_file_name
)

pop_df = pd.read_csv(pop_file_path, skiprows=4)
countries_df = pd.read_csv(
    "https://gist.githubusercontent.com/tadast/8827699/raw/f5cac3d42d16b78348610fc4ec301e9234f82821/countries_codes_and_coordinates.csv"
)

pop_df = pop_df[["Country Name", "Country Code", "2022"]]
countries_df = countries_df[["Alpha-2 code", "Alpha-3 code"]]
countries_df["Country Code"] = (
    countries_df["Alpha-3 code"].str.replace('"', "").str.strip()
)
countries_df["isoa2"] = countries_df["Alpha-2 code"].str.replace('"', "").str.strip()

filtered_df = pd.merge(pop_df, countries_df, on="Country Code", how="left")
filtered_df = filtered_df[
    (filtered_df["Alpha-2 code"].notna()) & (filtered_df["2022"] > 10e5)
]


file_name = os.path.join(os.path.dirname(os.path.realpath(__file__)), "countries.json")
with open(file_name, encoding="utf-8") as f:
    countries = json.load(f)

filtered_countries = []
for country in countries:
    if not filtered_df[filtered_df["isoa2"] == country["isoa2"]].empty:
        filtered_countries.append(int(country["countryCode"]))


file_name = os.path.join(os.path.dirname(os.path.realpath(__file__)), "earth_data.json")
with open(file_name, encoding="utf-8") as f:
    earth_data = json.load(f)

dataset = []
for element in earth_data:
    if (element["countryCode"] in filtered_countries) & (element["value"] > 0):
        dataset.append(
            {
                "date": str(element["year"]) + "-01-01",
                "name": element["shortName"],
                "value": element["value"],
            }
        )

save_file(dataset, "dataset.json")

shutil.rmtree(zip_temp_path)
