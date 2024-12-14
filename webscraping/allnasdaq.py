import pandas as pd
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import pytz
from datetime import datetime

#read stock acronyms and skip header
stocks_df = pd.read_csv('stocks.csv')
symbols = stocks_df.iloc[1:, 0]  #ignores header (skip first row)

#set up webdriver instance (this sucks i hate webdriver)
def create_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    return webdriver.Chrome(options=chrome_options)

#scrapes a single stock
def scrape_stock_data(symbol):
    driver = create_driver()
    url = f"https://www.tradingview.com/symbols/NASDAQ-{symbol}/"
    driver.get(url)
    time.sleep(1)  #mess with this till it works and doesnt time out

    soup = BeautifulSoup(driver.page_source, "html.parser")

    #find what you want and grab it
    name_element = soup.find('h1', class_='apply-overflow-tooltip title-HFnhSVZy')
    price_element = soup.find('span', class_='last-JWoJqCpY js-symbol-last')
    change_element = soup.find('span', class_='js-symbol-change-pt')
    times_element = soup.find('span', class_="js-symbol-lp-time")

    #use n/a if it doesnt find something because it borked out otherwise
    #get current time in est
    timezone_est = pytz.timezone('US/Eastern')
    current_time = datetime.now(timezone_est).strftime('%Y-%m-%d %H:%M:%S %Z')
    name = name_element.text.strip() if name_element else "n/a"
    price = price_element.text.strip() if price_element else "n/a"
    change = change_element.text.strip() if change_element else "n/a"
    times = times_element.text.strip() if times_element else "n/a"

    #quits driver instance
    driver.quit()

    return {
        "Symbol": symbol,
        "Name": name,
        "Stock Price": price,
        "% Change": change,
        "Time": times
    }

#read existing stock data if available
try:
    with open('stock_data.json', 'r') as infile:
        stock_data = json.load(infile)
except FileNotFoundError:
    stock_data = {}

#timer for seeing how long script takes
start_time = time.time()

#parallel processing
max_threads = 40  #amount of threads
with ThreadPoolExecutor(max_workers=max_threads) as executor:
    futures = {executor.submit(scrape_stock_data, symbol): symbol for symbol in symbols}

    for future in as_completed(futures):
        result = future.result()
        symbol = result["Symbol"]
        if symbol in stock_data:
            if "History" not in stock_data[symbol]:
                stock_data[symbol]["History"] = []
            stock_data[symbol]["History"].append({
                "Stock Price": result["Stock Price"],
                "% Change": result["% Change"],
                "Time": result["Time"]
            })
        else:
            stock_data[symbol] = {
                "Name": result["Name"],
                "Stock Price": result["Stock Price"],
                "% Change": result["% Change"],
                "Time": result["Time"],
                "History": []
            }

#end timer
end_time = time.time()

#display runtime
runtime = end_time - start_time
print(f"total runtime: {runtime:.2f} seconds")

#write to json
with open("stock_data.json", "w") as outfile:
    json.dump(stock_data, outfile, indent=4)

print("data has been saved to stock_data.json")

#read unicode and make it a -
for symbol, data in stock_data.items():
    if "% Change" in data:
        data["% Change"] = data["% Change"].replace("\u2212", "-")

#resave updated data
with open("stock_data.json", "w") as outfile:
    json.dump(stock_data, outfile, indent=4)

print("replaced unicode minus signs with hyphens in stock_data.json")
