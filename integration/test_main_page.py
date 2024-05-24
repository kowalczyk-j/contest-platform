from selenium.webdriver.common.by import By
from selenium.webdriver import Chrome
from integration.selenium_utils import (
    element_present,
    login_decorator,
    wait_for_elem
)


@login_decorator("admin", "admin")
def test_main_page(chrome_driver: Chrome):
    ok_button = element_present(
        chrome_driver,
        By.CSS_SELECTOR,
        ".MuiButton-containedSuccess"
    )
    assert ok_button
    ok_button.click()
    logo_elem = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//a[contains(text(), 'Strona Główna')]"
    )
    assert logo_elem
    logo_elem.click()
    expected_url = "https://www.fundacjabowarto.pl/"
    current = chrome_driver.current_url
    assert expected_url == current
