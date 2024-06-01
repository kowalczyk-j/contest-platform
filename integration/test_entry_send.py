from integration.selenium_utils import (
    login_decorator,
    wait_for_elem,
    navigate_to_entry_form)
from selenium.webdriver.common.by import By
from selenium.webdriver import Chrome
from functools import wraps
from integration.database_connector import (
    count_all_entries,
    databaset_update_sleep
)


def assert_same_count(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        initial_count = count_all_entries()
        result = func(*args, **kwargs)
        databaset_update_sleep()
        final_count = count_all_entries()
        assert initial_count == final_count
        return result
    return wrapper


def assert_create_count(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        initial_count = count_all_entries()
        result = func(*args, **kwargs)
        databaset_update_sleep()
        final_count = count_all_entries()
        assert initial_count + 1 == final_count
        return result
    return wrapper


def fill_in_entry_form(
        chrome_driver: Chrome,
        name,
        surname,
        email,
        title,
        checkbox_marked: bool):
    name_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "participant-name"
    )
    name_tx.send_keys(name)
    surname_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "participant-surname"
    )
    surname_tx.send_keys(surname)
    email_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "email"
    )
    email_tx.clear()
    email_tx.send_keys(email)
    title_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "title"
    )
    title_tx.send_keys(title)

    if checkbox_marked:
        box = wait_for_elem(
            chrome_driver,
            By.ID,
            "consent-checkbox"
        )
        box.click()
    ok_button = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//button[contains(text(), 'Zgłoś swoją pracę')]"
    )
    ok_button.click()


@assert_same_count
@login_decorator("admin", "admin")
def test_entry_send_no_title(chrome_driver):
    """requiers superuser with given login data"""
    navigate_to_entry_form(chrome_driver)
    fill_in_entry_form(
        chrome_driver,
        "name",
        "surname",
        "ema",
        "",
        True
    )


@assert_same_count
@login_decorator("admin", "admin")
def test_entry_send_no_name(chrome_driver):
    """requiers superuser with given login data"""
    navigate_to_entry_form(chrome_driver)
    fill_in_entry_form(
        chrome_driver,
        "",
        "surname",
        "ema",
        "dsds",
        True
    )


@assert_same_count
@login_decorator("admin", "admin")
def test_entry_send_no_surname(chrome_driver):
    """requiers superuser with given login data"""
    navigate_to_entry_form(chrome_driver)
    fill_in_entry_form(
        chrome_driver,
        "name",
        "",
        "ema",
        "fdsfs",
        True
    )


@assert_same_count
@login_decorator("admin", "admin")
def test_entry_send_no_checkbox(chrome_driver):
    """requiers superuser with given login data"""
    navigate_to_entry_form(chrome_driver)
    fill_in_entry_form(
        chrome_driver,
        "name",
        "surname",
        "ema",
        "dasad",
        False
    )


@assert_create_count
@login_decorator("admin", "admin")
def test_entry_send_success(chrome_driver):
    """requiers superuser with given login data"""
    navigate_to_entry_form(chrome_driver)
    fill_in_entry_form(
        chrome_driver,
        "name",
        "surname",
        "ema",
        "dasad",
        True
    )
