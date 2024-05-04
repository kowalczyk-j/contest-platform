from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

WAITING_TIMEOUT = 10


def wait_for_elem(chrome_driver, by: By, text: str):
    return WebDriverWait(chrome_driver, WAITING_TIMEOUT).until(
        EC.presence_of_element_located((by, text))
    )
