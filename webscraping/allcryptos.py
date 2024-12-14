import pandas as pd
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import pytz

#webdriver
def create_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    return webdriver.Chrome(options=chrome_options)

#crypto data
def scrape_crypto_details(acronym):
    driver = create_driver()
    url = f"https://www.tradingview.com/symbols/{acronym}USD/?exchange=CRYPTO"
    driver.get(url)
    time.sleep(2) 

    soup = BeautifulSoup(driver.page_source, "html.parser")

    #data extract
    name_element = soup.find('h1', class_='apply-overflow-tooltip title-HFnhSVZy')
    price_element = soup.find('span', class_='last-JWoJqCpY js-symbol-last')
    change_element = soup.find('span', string=lambda text: text and (text.startswith("+") or text.startswith("−")))
    percentage_element = soup.find('span', class_='js-symbol-change-pt')

    name = name_element.text.strip() if name_element else "N/A"

    #price
    if price_element:
        price = ''.join(price_element.stripped_strings).replace("\u2212", "-")
    else:
        price = "N/A"

    #change and percentage
    if change_element:
        change = change_element.text.strip().replace("\u2212", "-")
    else:
        change = "N/A"

    if percentage_element:
        percentage = percentage_element.text.strip().replace("\u2212", "-")
    else:
        percentage = "N/A"

    #time in EST
    est = pytz.timezone('US/Eastern')
    current_time = datetime.now(est).strftime("%Y-%m-%d %H:%M:%S %Z")

    driver.quit()
    return {
        "Acronym": acronym,
        "Name": name,
        "Price": price,
        "Change": change,
        "Percentage": percentage,
        "Time": current_time
    }

#read cryptocurrency acronyms from json
with open('crypto_names.json', 'r') as infile:
    acronyms = json.load(infile)

#read existing crypto data if available
try:
    with open('crypto_data.json', 'r') as infile:
        crypto_data = json.load(infile)
except FileNotFoundError:
    crypto_data = {}

#timer to see how long the script takes
start_time = time.time()

#parallel processing to scrape data for each cryptocurrency
max_threads = 30  #number of threads
with ThreadPoolExecutor(max_workers=max_threads) as executor:
    futures = {executor.submit(scrape_crypto_details, acronym): acronym for acronym in acronyms}

    for future in as_completed(futures):
        result = future.result()
        acronym = result["Acronym"]
        if acronym in crypto_data:
            if "History" not in crypto_data[acronym]:
                crypto_data[acronym]["History"] = []
            crypto_data[acronym]["History"].append({
                "Price": result["Price"],
                "Change": result["Change"],
                "Percentage": result["Percentage"],
                "Time": result["Time"]
            })
        else:
            crypto_data[acronym] = {
                "Name": result["Name"],
                "Price": result["Price"],
                "Change": result["Change"],
                "Percentage": result["Percentage"],
                "Time": result["Time"],
                "History": []
            }

#end timer
end_time = time.time()

#display runtime
runtime = end_time - start_time
print(f"Total runtime: {runtime:.2f} seconds")

#write to JSON
with open("crypto_data.json", "w") as outfile:
    json.dump(crypto_data, outfile, indent=4)

print("Data has been saved to crypto_data.json")
