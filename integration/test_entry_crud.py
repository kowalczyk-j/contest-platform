from selenium.webdriver.common.by import By
from selenium.webdriver import Chrome
from integration.selenium_utils import (
    login_decorator,
    wait_for_elem,
    navigate_to_entries,
)
from integration.database_connector import (
    get_entry_status,
    databaset_update_sleep
)


def examine_entry_info(chrome_driver: Chrome):
    entry_name = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//p[contains(., 'Imię i nazwisko')]"
        )
    assert entry_name
    assert 'Malary Perłowski' in entry_name.text
    date_line = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//p[contains(., 'Zgłoszono')]"
        )
    assert date_line
    assert "2024-05-30" in date_line.text


def examine_fav_can_buttons(chrome_driver):
    star = wait_for_elem(
        chrome_driver,
        By.CSS_SELECTOR,
        "svg[data-testid='StarBorderIcon']"
    )
    can_button = wait_for_elem(
        chrome_driver,
        By.CSS_SELECTOR,
        "svg[data-testid='CancelIcon']"
    )
    assert star
    assert can_button
    star_active = "MuiIconButton-colorPrimary" in star.get_attribute("class")
    aria_hidden_value = can_button.get_attribute("aria-hidden")
    can_activated = False if aria_hidden_value == "false" else True
    assert not star_active
    assert can_activated
    fav, can = get_entry_status("Grabione listki")
    assert not fav
    assert can

    star.click()
    databaset_update_sleep()
    fav, can = get_entry_status("Grabione listki")
    assert fav
    assert not can


def examine_delete(chrome_driver: Chrome):
    delete = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//button[contains(text(), 'Usuń')]"
    )
    delete.click()
    conf = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//button[contains(text(), 'OK')]"
    )
    conf.click()
    conf = wait_for_elem(
        chrome_driver,
        By.XPATH,
        "//button[contains(text(), 'Usuwanie zgłoszenia nieudane')]"
    )
    # fav, can = get_entry_status("Grabione listki")
    # assert fav is not None
    # assert
    # TODO after fix


@login_decorator("admin", "admin")
def test_contest_form(chrome_driver: Chrome):
    chrome_driver = navigate_to_entries(chrome_driver)
    examine_entry_info(chrome_driver)
    examine_fav_can_buttons(chrome_driver)
    examine_delete(chrome_driver)
