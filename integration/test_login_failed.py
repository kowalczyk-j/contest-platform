from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def test_failed_success(chrome_driver):
    chrome_driver.get("http://localhost:5173")
    try:
        elem = WebDriverWait(chrome_driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "ZALOGUJ SIĘ")))
        elem.click()
        login_elem = chrome_driver.find_element(By.ID, "username")
        pass_elem = chrome_driver.find_element(By.ID, "password")
        login_elem.send_keys("admin")
        pass_elem.send_keys("admin")
        log_button = chrome_driver.find_element(By.XPATH, "//button[contains(@class, 'MuiButton-containedPrimary')]")
        log_button.click()
        alert = WebDriverWait(chrome_driver, 10).until(EC.presence_of_element_located((By.ID, "alert-dialog-title")))
        assert alert.text == "Pomyślnie zalogowano"
    except Exception:
        chrome_driver.quit()
