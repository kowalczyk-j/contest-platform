from selenium.webdriver import Chrome
from integration.selenium_utils import wait_for_elem, URL
from selenium.webdriver.common.by import By
from integration.database_connector import (
    count_users_by_name,
    databaset_update_sleep
)


def fill_in_register_form(
        chrome_driver: Chrome,
        username,
        email,
        password,
        passowrd_conf,
        first_name,
        last_name
        ):
    chrome_driver.get(URL)
    elem = wait_for_elem(chrome_driver, By.LINK_TEXT, "ZAREJESTRUJ SIĘ")
    elem.click()
    username_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "username"
    )
    email_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "email"
    )
    password_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "password"
    )
    password_conf_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "passwordConfirmation"
    )
    first_name_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "firstName"
    )
    sec_name_tx = wait_for_elem(
        chrome_driver,
        By.ID,
        "lastName"
    )
    username_tx.send_keys(username)
    email_tx.send_keys(email)
    password_tx.send_keys(password)
    password_conf_tx.send_keys(passowrd_conf)
    first_name_tx.send_keys(first_name)
    sec_name_tx.send_keys(last_name)
    reg_button = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//button[text()='Zarejestruj się']"
    )
    reg_button.click()
    xpath = "//p[@id='alert-dialog-description' and "
    xpath += "contains(@class, 'MuiTypography-root') and "
    xpath += "contains(@class, 'MuiDialogContentText-root')]"
    resp = wait_for_elem(
        chrome_driver,
        By.XPATH,
        xpath
    )
    return chrome_driver, resp


def test_register_username_taken(chrome_driver: Chrome):
    chrome_driver, resp = fill_in_register_form(
        chrome_driver,
        "admin",
        "sample@wp.pl",
        "sample",
        "sample",
        "sample",
        "sample"
    )
    assert resp.text == "Taki użytkownik już istnieje!"
    users_cnt = count_users_by_name("sample", "sample")
    assert users_cnt == 0


def test_register_password_missmatch(chrome_driver: Chrome):
    chrome_driver, resp = fill_in_register_form(
        chrome_driver,
        "adn",
        "sample@wp.pl",
        "sample",
        "sple",
        "sample",
        "sample"
    )
    assert resp.text == "Hasła nie są takie same."
    users_cnt = count_users_by_name("sample", "sample")
    assert users_cnt == 0


def test_register_email_taken(chrome_driver: Chrome):
    chrome_driver, resp = fill_in_register_form(
        chrome_driver,
        "adns",
        "admin@wp.pl",
        "sample",
        "sample",
        "sample",
        "sample"
    )
    assert resp.text == "user with this email already exists."
    users_cnt = count_users_by_name("sample", "sample")
    assert users_cnt == 0


def test_register_empty(chrome_driver: Chrome):
    chrome_driver, resp = fill_in_register_form(
        chrome_driver,
        "adns",
        "addsamin@wp.pl",
        "",
        "",
        "sample",
        "sample"
    )
    assert resp.text == "Rejestracja nieudana, spróbuj ponownie."
    users_cnt = count_users_by_name("sample", "sample")
    assert users_cnt == 0


def test_register_success(chrome_driver: Chrome):
    chrome_driver, resp = fill_in_register_form(
        chrome_driver,
        "adasns",
        "addsamin@wp.pl",
        "sample",
        "sample",
        "sample",
        "sample"
    )
    assert resp.text == "Możesz teraz zalogować się podanym loginem i hasłem."
    users_cnt = count_users_by_name("sample", "sample")
    databaset_update_sleep(3)
    assert users_cnt == 1
