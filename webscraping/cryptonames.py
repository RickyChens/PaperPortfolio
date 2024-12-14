import pandas as pd
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

#set up driver
def create_driver():
    chrome_options = Options()
    #remove headless client
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    return webdriver.Chrome(options=chrome_options)

#scrape content
def scrape_crypto_data():
    driver = create_driver()
    url = "https://www.tradingview.com/markets/cryptocurrencies/prices-all/"
    driver.get(url)

    #click load more until no more loading 

    input("Press Enter after loading all the data...")  #wait

    #parse content
    soup = BeautifulSoup(driver.page_source, "html.parser")
    crypto_elements = soup.select("a.apply-common-tooltip.tickerNameBox-GrtoTeat.tickerName-GrtoTeat")

    crypto_data = []
    for crypto in crypto_elements:
        #acronym
        acronym = crypto.text.strip() if crypto else "N/A"

        crypto_data.append({
            "Acronym": acronym
        })

    driver.quit()
    return crypto_data

#timer
start_time = time.time()

#scrape after manual load
crypto_data = scrape_crypto_data()

#end timer
end_time = time.time()

#display runtime
runtime = end_time - start_time
print(f"Total runtime: {runtime:.2f} seconds")

#write to json
with open("crypto_names.json", "w") as outfile:
    json.dump(crypto_data, outfile, indent=4)

print("Data has been saved to crypto_names.json")
