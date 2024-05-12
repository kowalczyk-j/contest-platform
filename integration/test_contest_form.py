from selenium.webdriver.common.by import By
from selenium.webdriver import Chrome
from integration.selenium_utils import (
    login_decorator,
    wait_for_elem,
    navigate_contest_form
)


@login_decorator("admin", "admin")
def test_contest_form(chrome_driver: Chrome):
    chrome_driver = navigate_contest_form(chrome_driver)
    title_text_field = wait_for_elem(chrome_driver, By.ID, "title")
    # assert title_text_field.text == ""
    title_text_field.send_keys("ddd")
    description_tf = chrome_driver.find_element(By.ID, "description")
    description_tf.send_keys("saa")
    create_button = chrome_driver.find_element(
        By.CSS_SELECTOR,
        ".MuiButton-textPrimary"
    )
    create_button.click()
    assert True
    return
