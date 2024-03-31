import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture
def driver():
    test_url = "http://localhost:5173"
    chrome_options = Options()
    chrome_options.add_experimental_option("detach", True)
    driver = webdriver.Chrome(keep_alive=True, options=chrome_options)
    yield driver
    driver.quit()

def test_failed_login(driver):
    driver.get("http://localhost:5173")
    try:
        elem = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "ZALOGUJ SIĘ")))
        elem.click()
        login_elem = driver.find_element(By.ID, "username")
        pass_elem = driver.find_element(By.ID, "password")
        login_elem.send_keys("sample")
        pass_elem.send_keys("sample")
        log_button = driver.find_element(By.XPATH, "//button[contains(@class, 'MuiButton-containedPrimary')]")
        log_button.click()
        alert = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "alert-dialog-title")))
        assert alert.text == "Logowanie nieudane"
    except Exception:
        driver.quit()
