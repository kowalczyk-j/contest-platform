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


def assert_present(chrome_driver: Chrome, by: By, text: str) -> bool:
    try:
        chrome_driver.find_element(by, text)
        return True
    except Exception:
        return False


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
            func(chrome_driver, *args, **kwargs)
        return wrapper
    return decorator


def navigate_contest_form(chrome_driver: Chrome):
    ok_button = chrome_driver.find_element(
        By.CSS_SELECTOR,
        ".MuiButton-containedSuccess"
    )
    ok_button.click()
    print("fdfd")
    add_contest = wait_for_elem(chrome_driver, By.LINK_TEXT, "Dodaj konkurs")
    add_contest.click()
    print("fdfd")
    return chrome_driver
