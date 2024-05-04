from selenium.webdriver.common.by import By
from integration.selenium_utils import wait_for_elem


def login(chrome_driver, login: str, passw: str) -> str:
    chrome_driver.get("http://localhost:5173")
    elem = wait_for_elem(chrome_driver, By.LINK_TEXT, "ZALOGUJ SIĘ")
    elem.click()
    login_elem = chrome_driver.find_element(By.ID, "username")
    pass_elem = chrome_driver.find_element(By.ID, "password")
    login_elem.send_keys(login)
    pass_elem.send_keys(passw)
    log_button = chrome_driver.find_element(
        By.XPATH,
        "//button[contains(@class, 'MuiButton-containedPrimary')]"
    )
    log_button.click()
    alert = wait_for_elem(chrome_driver, By.ID, "alert-dialog-title")
    return alert.text


def test_failed_login(chrome_driver):
    login_result = login(
        chrome_driver,
        "sample",
        "sample"
    )
    assert login_result == "Logowanie nieudane"


def test_login_successful(chrome_driver):
    """requiers superuser with given login data"""
    login_result = login(
        chrome_driver,
        "admin",
        "admin"
    )
    assert login_result == "Pomyślnie zalogwano"
