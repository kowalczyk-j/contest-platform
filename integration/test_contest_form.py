from selenium.webdriver.common.by import By
from datetime import datetime
from selenium.webdriver import Chrome
from integration.selenium_utils import (
    login_decorator,
    navigate_contest_form,
    element_present,
)


def examine_checkboxes(chrome_driver: Chrome):
    group_prefix = "//span[text()='grupowy']"
    indiv_prefix = "//span[text()='indywidualny']"
    suffix = "/preceding-sibling::span/input[@type='radio']"

    group_checkbox = chrome_driver.find_element(
        By.XPATH,
        group_prefix + suffix
    )
    assert group_checkbox
    assert not group_checkbox.is_selected(), "Radio button is checked"

    individual_checkbox = chrome_driver.find_element(
        By.XPATH,
        indiv_prefix + suffix
    )
    assert individual_checkbox
    assert not individual_checkbox.is_selected(), "Radio button is checked"

    group_checkbox.click()
    assert group_checkbox.is_selected()

    individual_checkbox.click()
    assert not individual_checkbox.is_selected()
    assert not group_checkbox.is_selected()


def examine_date(chrome_driver: Chrome):
    date_css = ".MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-"
    date_css += "inputAdornedEnd.css-nxo287-MuiInputBase"
    date_css += "-input-MuiOutlinedInput-input"

    start_date = element_present(
        chrome_driver,
        By.CSS_SELECTOR,
        date_css
    )
    assert start_date

    current_date_time = datetime.now()
    formatted_date = current_date_time.strftime("%d-%m-%Y")
    assert start_date.get_attribute("value") == formatted_date


def examine_inputs(chrome_driver: Chrome):
    assert element_present(chrome_driver, By.ID, "title")
    assert element_present(chrome_driver, By.ID, "description")
    assert element_present(
        chrome_driver,
        By.CSS_SELECTOR,
        ".MuiButton-textPrimary"
    )


def examine_criterion(chrome_driver: Chrome):
    button = element_present(
        chrome_driver,
        By.CLASS_NAME,
        "MuiButton-root"
        )
    assert button
    button.click()


@login_decorator("admin", "admin")
def test_contest_form(chrome_driver: Chrome):
    chrome_driver = navigate_contest_form(chrome_driver)

    examine_inputs(chrome_driver)
    examine_checkboxes(chrome_driver)
    examine_date(chrome_driver)
    examine_criterion(chrome_driver)

    return
