import pytest
from selenium import webdriver


@pytest.fixture
def chrome_driver(request):
    driver = webdriver.Chrome()
    request.addfinalizer(driver.quit)
    return driver
