from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import pytest
from selenium import webdriver

@pytest.fixture
def driver():
    service = Service("chromedriver.exe")
    chrome_options = Options()
    chrome_options.add_experimental_option("detach", True)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    yield driver
    driver.quit()