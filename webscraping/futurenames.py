import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

def create_driver():
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    return webdriver.Chrome(options=chrome_options)

def scrape_futures_data():
    driver = create_driver()
    url = "https://www.tradingview.com/markets/futures/quotes-all/"
    driver.get(url)

    input("Press Enter after loading all the data...")  

    soup = BeautifulSoup(driver.page_source, "html.parser")

    futures_data = {}

    for link in soup.find_all('a', class_='apply-common-tooltip tickerNameBox-GrtoTeat tickerName-GrtoTeat'):
        acronym = link.text.strip()
        futures_data[acronym] = None

    driver.quit()
    return futures_data


if __name__ == "__main__":

    futures_data = scrape_futures_data()

    with open('futures_names.json', 'w') as outfile:
        json.dump(list(futures_data.keys()), outfile, indent=4)

    print("Acronym data has been saved to futures_names.json")
