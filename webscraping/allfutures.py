import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import pytz
#set up webdriver
def create_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    return webdriver.Chrome(options=chrome_options)

#scrapes data
def scrape_futures_details(acronym):
    driver = create_driver()
    url = f"https://www.tradingview.com/symbols/{acronym}/"
    driver.get(url)
    time.sleep(2)  

    soup = BeautifulSoup(driver.page_source, "html.parser")

    #futures date
    name_element = soup.find('h1', class_='apply-overflow-tooltip title-HFnhSVZy')
    price_element = soup.find('span', class_='last-JWoJqCpY js-symbol-last')
    change_element = soup.find('span', string=lambda text: text and (text.startswith("+") or text.startswith("−")))
    percentage_element = soup.find('span', class_='js-symbol-change-pt')

    name = name_element.text.strip() if name_element else "N/A"

    #price
    if price_element:
        price = ''.join(price_element.stripped_strings).replace("\u2212", "-").replace("\u2013", "-")
    else:
        price = "N/A"

    #extracting change and percent
    if change_element:
        change = change_element.text.strip().replace("\u2212", "-").replace("\u2013", "-")
    else:
        change = "N/A"

    if percentage_element:
        percentage = percentage_element.text.strip().replace("\u2212", "-").replace("\u2013", "-")
    else:
        percentage = "N/A"

    #get current time in est
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

#read acrynoms
with open('futures_names.json', 'r') as infile:
    acronyms = json.load(infile)

#read existing future data
try:
    with open('futures_data.json', 'r') as infile:
        futures_data = json.load(infile)
except FileNotFoundError:
    futures_data = {}

#timer
start_time = time.time()

#parallel processing stuff
max_threads = 10  #threds
with ThreadPoolExecutor(max_workers=max_threads) as executor:
    futures = {executor.submit(scrape_futures_details, acronym): acronym for acronym in acronyms}

    for future in as_completed(futures):
        result = future.result()
        acronym = result["Acronym"]
        if acronym in futures_data:
            if "History" not in futures_data[acronym]:
                futures_data[acronym]["History"] = []
            futures_data[acronym]["History"].append({
                "Price": result["Price"],
                "Change": result["Change"],
                "Percentage": result["Percentage"],
                "Time": result["Time"]
            })
        else:
            futures_data[acronym] = {
                "Name": result["Name"],
                "Price": result["Price"],
                "Change": result["Change"],
                "Percentage": result["Percentage"],
                "Time": result["Time"],
                "History": []
            }

#ent timer
end_time = time.time()

#runtime display
runtime = end_time - start_time
print(f"Total runtime: {runtime:.2f} seconds")

#json
with open("futures_data.json", "w") as outfile:
    json.dump(futures_data, outfile, indent=4)

print("Data has been saved to futures_data.json")
