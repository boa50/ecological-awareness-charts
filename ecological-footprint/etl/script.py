### Ecological Footprint API documentation
# https://data.footprintnetwork.org/#/api

from dotenv import load_dotenv
import os
import requests
import json
from pathlib import Path
import time

load_dotenv()
user_name = os.environ.get("user_name")
api_key = os.environ.get("api_key")
base_url = "https://api.footprintnetwork.org/v1/"
headers = {"HTTP_ACCEPT": "application/json"}

### Control variables for testing purposes
GET_COUNTRIES = False
GET_YEARS = False
GET_EARTH = True


### Auxiliary functions
def get_data(url_param: str):
    url = base_url + url_param
    response = requests.get(url, auth=(user_name, api_key), headers=headers)

    print("Retrieving " + url_param + " result:", response.status_code)

    return response.json()


def save_file(data: json, file_name: str):
    full_file_name = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), file_name
    )
    with open(full_file_name, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


### Data proessing
if GET_COUNTRIES:
    countries = [
        {"shortName": x["shortName"], "countryCode": x["countryCode"]}
        for x in get_data("countries")
        if x["isoa2"] != None and x["isoa2"] != ""
    ]

    save_file(countries, "countries.json")
else:
    file_name = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "countries.json"
    )
    with open(file_name, encoding="utf-8") as f:
        countries = json.load(f)

if GET_YEARS:
    years = get_data("years")
    save_file(years, "years.json")
else:
    file_name = os.path.join(os.path.dirname(os.path.realpath(__file__)), "years.json")

    with open(file_name, encoding="utf-8") as f:
        years = json.load(f)


if GET_EARTH:
    urls_param = []
    # for element in years[0:1]:
    #     year = str(element["year"])
    #     for element in countries:
    #         countryCode = element["countryCode"]
    #         url_param = "data/" + countryCode + "/" + year + "/earth"
    #         urls_param.append(url_param)

    ### Creating URLs for a single year
    year = "2022"
    for element in countries:
        countryCode = element["countryCode"]
        url_param = "data/" + countryCode + "/" + year + "/earth"
        urls_param.append(url_param)


    file_name = "earth_data.json"
    file_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), file_name)

    data_file = Path(file_path)
    if not data_file.is_file():
        save_file(json.loads("[]"), file_name)


    for url_param in urls_param:
        with open(file_path, encoding="utf-8") as f:
            earth_data = json.load(f)

        data = [
            {
                "year": x.get("year", 1900),
                "countryCode": x.get("countryCode", -1),
                "shortName": x.get("shortName", ""),
                "value": x.get("value", -1)
            }
            for x in get_data(url_param)
        ]

        if data:
            earth_data.append(data[0])

            save_file(earth_data, file_name)

        time.sleep(1)
