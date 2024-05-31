from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import Chrome
import functools

WAITING_TIMEOUT = 10
URL = "http://localhost:5173"


def wait_for_elem(chrome_driver, by: By, text: str):
    return WebDriverWait(chrome_driver, WAITING_TIMEOUT).until(
        EC.presence_of_element_located((by, text))
    )


def element_present(chrome_driver: Chrome, by: By, text: str):
    try:
        elem = chrome_driver.find_element(by, text)
        return elem
    except Exception:
        return None


def elements_present(chrome_driver: Chrome, by: By, text: str):
    try:
        elems = chrome_driver.find_elements(by, text)
        return elems
    except Exception:
        return None


def login_decorator(login, passw):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(chrome_driver, *args, **kwargs):
            chrome_driver.get(URL)
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
            wait_for_elem(chrome_driver, By.ID, "alert-dialog-title")
            return func(chrome_driver, *args, **kwargs)
        return wrapper
    return decorator


def navigate_contest_form(chrome_driver: Chrome):
    ok_button = chrome_driver.find_element(
        By.CSS_SELECTOR,
        ".MuiButton-containedSuccess"
    )
    ok_button.click()
    add_contest = wait_for_elem(chrome_driver, By.LINK_TEXT, "Dodaj konkurs")
    add_contest.click()
    return chrome_driver


def navigate_to_entries(chrome_driver: Chrome):
    ok_button = element_present(
        chrome_driver,
        By.CSS_SELECTOR,
        ".MuiButton-containedSuccess"
    )
    assert ok_button
    ok_button.click()
    view_button = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//button[contains(text(), 'Zobacz więcej')]"
        )
    assert view_button
    view_button.click()
    xpath = "//button[span[contains(@class, 'MuiButton-endIcon')]"
    xpath += " and contains(text(), 'Nadesłane prace')]"
    entry_button = wait_for_elem(
        chrome_driver,
        By.XPATH,
        xpath
        )
    assert entry_button
    entry_button.click()
    return chrome_driver
