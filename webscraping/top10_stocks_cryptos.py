import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

#set up webdriver
def create_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    return webdriver.Chrome(options=chrome_options)

#scrape large cap stocks
def scrape_large_cap_stocks():
    driver = create_driver()
    url = "https://www.tradingview.com/markets/stocks-usa/market-movers-large-cap/"
    driver.get(url)
    time.sleep(2)  #wait for the page to load completely

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    stock_data = []
    rows = soup.find_all('a', class_='apply-common-tooltip tickerNameBox-GrtoTeat tickerName-GrtoTeat', href=True)[:15]

    def process_row(row):
        acronym = row.text.strip() if row else "n/a"
        name_element = row.find_next('sup', class_='apply-common-tooltip tickerDescription-GrtoTeat')
        name = name_element.text.strip() if name_element else "n/a"

        driver = create_driver()
        stock_url = f"https://www.tradingview.com{row['href']}"
        driver.get(stock_url)
        time.sleep(2)

        stock_soup = BeautifulSoup(driver.page_source, "html.parser")
        price_element = stock_soup.find('span', class_='last-JWoJqCpY js-symbol-last')
        price = price_element.text.strip() if price_element else 'n/a'
        driver.quit()

        return {
            "Acronym": acronym,
            "Name": name,
            "Price": price
        }

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(process_row, row) for row in rows]
        for future in as_completed(futures):
            try:
                stock_data.append(future.result())
            except Exception as exc:
                print(f"An error occurred: {exc}")

    return stock_data

#scrape large cap cryptos
def scrape_large_cap_cryptos():
    driver = create_driver()
    url = "https://www.tradingview.com/markets/cryptocurrencies/prices-large-cap/"
    driver.get(url)
    time.sleep(5)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    crypto_data = []
    rows = soup.find_all('a', class_='apply-common-tooltip tickerNameBox-GrtoTeat tickerName-GrtoTeat', href=True)[:15]

    def process_row(row):
        acronym = row.text.strip() if row else "n/a"
        name_element = row.find_next('sup', class_='apply-common-tooltip tickerDescription-GrtoTeat')
        name = name_element.text.strip() if name_element else "n/a"

        driver = create_driver()
        crypto_url = f"https://www.tradingview.com{row['href']}"
        driver.get(crypto_url)
        time.sleep(2)

        crypto_soup = BeautifulSoup(driver.page_source, "html.parser")
        price_element = crypto_soup.find('span', class_='last-JWoJqCpY js-symbol-last')
        price = price_element.text.strip() if price_element else 'n/a'
        driver.quit()

        return {
            "Acronym": acronym,
            "Name": name,
            "Price": price
        }

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(process_row, row) for row in rows]
        for future in as_completed(futures):
            try:
                crypto_data.append(future.result())
            except Exception as exc:
                print(f"An error occurred: {exc}")

    return crypto_data

#write scraped data to json
def save_to_json(data, filename='top10.json'):
    with open(filename, 'w') as outfile:
        json.dump(data, outfile, indent=4)
    print(f"data has been saved to {filename}")

#if the script is called directly, execute the following
if __name__ == "__main__":
    stock_data = scrape_large_cap_stocks()
    save_to_json(stock_data, filename=f"../frontend/data/top10_stocks.json")

    crypto_data = scrape_large_cap_cryptos()
    save_to_json(crypto_data, filename=f"../frontend/data/top10_cryptos.json")
