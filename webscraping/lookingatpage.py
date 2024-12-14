import json
import time
import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import pytz

#set up webdriver
def create_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    return webdriver.Chrome(options=chrome_options)

#scrape data based on type
def scrape_data(driver, acronym, is_crypto=False):
    #determine the URL based on the type 
    if is_crypto:
        url = f"https://www.tradingview.com/symbols/{acronym}USD/?exchange=CRYPTO"
    else:
        url = f"https://www.tradingview.com/symbols/{acronym}/"
    
    driver.get(url)
    time.sleep(2)  #adjust to avoid timeouts

    soup = BeautifulSoup(driver.page_source, "html.parser")

    #extract data
    price_element = soup.find('span', class_='last-JWoJqCpY js-symbol-last')

    #price
    if price_element:
        price = ''.join(price_element.stripped_strings).replace("\u2212", "-")
        try:
            return float(price.replace(',', ''))
        except ValueError:
            print(f"Unexpected price format: {price}")
            return None
    else:
        return None

#update data in the specified format
def update_data(driver, acronym, start_time, is_crypto=False):
    
    filename = f"../frontend/Data/{acronym.upper()}_data.json"
    #read existing data if available
    try:
        with open(filename, 'r') as infile:
            data = json.load(infile)
    except FileNotFoundError:
        data = []

    #scrape new data
    current_price = scrape_data(driver, acronym, is_crypto)

    if current_price is None:
        print("Failed to retrieve price data.")
        return

    #set end time and finalize the data
    current_time = datetime.now()
    next_interval = start_time + timedelta(minutes=5 - start_time.minute % 5, seconds=-start_time.second, microseconds=-start_time.microsecond)

    #check if we need to create a new candlestick because an interval has passed
    if len(data) == 0 or data[-1]['finalized'] or (current_time.minute // 5 > datetime.strptime(data[-1]['starttime'], "%Y-%m-%d %H:%M:%S").minute // 5):
        #start a new candlestick if there's no existing data, the previous one is finalized, or we have passed a new 5-minute interval
        if len(data) > 0 and not data[-1]['finalized']:
            #finalize the previous candlestick if not already finalized
            closest_interval = data[-1]['starttime']
            start_datetime = datetime.strptime(closest_interval, "%Y-%m-%d %H:%M:%S")
            closest_interval_time = start_datetime + timedelta(minutes=5 - start_datetime.minute % 5)
            data[-1]['endtime'] = closest_interval_time.strftime("%Y-%m-%d %H:%M:%S")
            data[-1]['finalized'] = True
        #start a new candlestick
        new_data = {
            "x": current_time.strftime("%Y-%m-%d %H:%M:%S"),
            "open": current_price,
            "high": current_price,
            "low": current_price,
            "close": current_price,
            "starttime": current_time.strftime("%Y-%m-%d %H:%M:%S"),
            "endtime": None,
            "finalized": False
        }
        data.append(new_data)
    else:
        #update the current candlestick if within the same 5-minute interval
        data[-1]['high'] = max(data[-1]['high'], current_price)
        data[-1]['low'] = min(data[-1]['low'], current_price)
        data[-1]['close'] = current_price

    #write updated data to file
    with open(filename, 'w') as outfile:
        json.dump(data, outfile, indent=4)

    print(f"Data for {acronym} has been updated in {filename}")

#continuously update data
def continuous_update(acronym, is_crypto=False):
    driver = create_driver()
    try:
        while True:
            #calculate time to the next 5-minute interval
            current_time = datetime.now()
            minutes = (current_time.minute // 5 + 1) * 5
            next_interval = current_time.replace(minute=minutes % 60, second=0, microsecond=0)
            if minutes >= 60:
                next_interval += timedelta(hours=1)
            time_to_wait = (next_interval - current_time).total_seconds()
            print(f"Scraping data for the current candlestick. Waiting for {time_to_wait:.2f} seconds until the next interval starts.")

            start_time = current_time
            while datetime.now() < next_interval:
                update_data(driver, acronym, start_time, is_crypto)
                time.sleep(5)  #update every 5 seconds to continuously grab data

            #finalize the current candlestick at the end of the interval
            update_data(driver, acronym, start_time, is_crypto)
            print(f"Candlestick finalized at {next_interval.strftime('%Y-%m-%d %H:%M:%S')}.")

            #set start_time to the next interval for the new candlestick
            start_time = next_interval

    except KeyboardInterrupt:
        print("Stopping continuous update.")
    finally:
        driver.quit()

# Example usage
if __name__ == "__main__":
    acronym = sys.argv[1].strip()
    cryptoCheck = sys.argv[2].strip()  #set True if the asset is a cryptocurrency
    if cryptoCheck == "Crypto":
        is_crypto = True
    else:
        is_crypto = False
    
    continuous_update(acronym, is_crypto)