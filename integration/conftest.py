from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import pytest
from selenium import webdriver
import os

@pytest.fixture
def chrome_driver(request):
    driver = webdriver.Chrome()
    request.addfinalizer(driver.quit)
    return driver