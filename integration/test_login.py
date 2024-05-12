from integration.selenium_utils import login_decorator, wait_for_elem
from selenium.webdriver.common.by import By


@login_decorator("sample", "sample")
def test_failed_login(chrome_driver):
    login_result = wait_for_elem(chrome_driver, By.ID, "alert-dialog-title")
    assert login_result.text == "Logowanie nieudane"
    return


@login_decorator("admin", "admin")
def test_login_successful(chrome_driver):
    """requiers superuser with given login data"""
    login_result = wait_for_elem(chrome_driver, By.ID, "alert-dialog-title")
    print(login_result.text)
    assert login_result.text == "Pomyślnie zalogwano"
    return
