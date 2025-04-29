## Comboios de Portugal
import time
from selenium import webdriver
from selenium.webdriver.common.by import By

import datetime

main_url = "https://www.cp.pt/passageiros/pt"

XPATH_start_location_input ="/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div/div/div/div/div/form/div/div[1]/div[1]/div/input"
XPATH_destination_input = "/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div/div/div/div/div/form/div/div[1]/div[2]/div/input"
XPATH_search_button = "/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div/div/div/div/div/form/div/div[2]/div[3]/input"

XPATH_arrived_hour= "//*[starts-with(@id, 'goDeparTime')]"

def get_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("disable-infobars")
    options.add_argument("start-maximized")
    options.add_argument("headless")

    options.add_argument("disable-dev-shm-usage")
    options.add_argument("no-sandbox")
    options.add_argument("disable-popup-blocking")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_argument("disable-blink-features=AutomationConttrolled")

    driver = webdriver.Chrome(options=options)
    driver.get(main_url)

    return driver

def get_train_hours(start_location, destination):
    driver = get_driver()

    start_location_input = driver.find_element(By.XPATH, XPATH_start_location_input )
    start_location_input.send_keys(start_location)

    destination_input = driver.find_element(By.XPATH, XPATH_destination_input )
    destination_input.send_keys(destination)

    
    search_button = driver.find_element(By.XPATH, XPATH_search_button)
    
    time.sleep(2)


    search_button.click()
    

    time.sleep(2)


    elements = driver.find_elements(By.XPATH, XPATH_arrived_hour)
    hours = []
    for e in elements:

        hour_str = e.text
        formated_hour = hour_str.replace('h', ':')
        hour_datetime = datetime.datetime.strptime(formated_hour, "%H:%M")

        hours.append(hour_datetime)

    driver.quit()
    return hours

def get_next_train(start_location, destination, hour):
    train_hours= get_train_hours(start_location, destination)
    next_train = None
    for train_hour in train_hours:
        date_to_compare = datetime.datetime.combine(hour.date(), train_hour.time())
        if train_hour.time() > hour.time():
            next_train = date_to_compare
            break

    return next_train
