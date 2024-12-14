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

#scrape futures

def scrape_futures():
    driver = create_driver()
    url = "https://www.tradingview.com/markets/futures/quotes-all/"
    driver.get(url)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'cellWrapper-RfwJ5pFm') and contains(., 'Price')]")))

    #close any potential popups
    try:
        close_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'tv-dialog__close-button')]"))
        )
        close_button.click()
        time.sleep(1)
    except Exception as e:
        print("No popup to close.")

    #click the price column to sort by price
    try:
        price_sort_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'cellWrapper-RfwJ5pFm') and contains(., 'Price')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView();", price_sort_button)
        driver.execute_script("arguments[0].click();", price_sort_button)
        time.sleep(2)  #wait for sorting to complete
    except Exception as e:
        print(f"Failed to click price sort button: {e}")

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    futures_data = []
    rows = soup.find_all('a', class_='apply-common-tooltip tickerNameBox-GrtoTeat tickerName-GrtoTeat', href=True)[:15]

    for row in rows:
        acronym = row.text.strip() if row else "n/a"
        name_element = row.find_next('sup', class_='apply-common-tooltip tickerDescription-GrtoTeat')
        name = name_element.text.strip() if name_element else "n/a"
        price_element = row.find_next('td', class_='cell-RLhfr_y4 right-RLhfr_y4')
        price = price_element.text.strip().replace("\u202f", "") if price_element else "N/A"

        futures_data.append({
            "Acronym": acronym,
            "Name": name,
            "Price": price
        })

    return futures_data

#write scraped data to json
def save_to_json(data, filename=f'top10.json'):
    with open(filename, 'w') as outfile:
        json.dump(data, outfile, indent=4)
    print(f"data has been saved to {filename}")

#if the script is called directly, execute the following
if __name__ == "__main__":
    futures_data = scrape_futures()
    save_to_json(futures_data, filename=f"../frontend/data/top10_futures.json")

