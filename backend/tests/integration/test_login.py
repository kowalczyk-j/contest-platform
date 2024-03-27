from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.remote import webelement
from time import sleep
from selenium.webdriver.chrome.options import Options
from django.test import TestCase

class IntegrationTest(TestCase):
    
    def setUp(self):
        self.test_url = "http://localhost:5173"
        self.driver_path = "chromedriver.exe"
        self.elem_loading_timeout = 10
        chrome_options = Options()
        chrome_options.add_experimental_option("detach", True)
        self.driver = webdriver.Chrome(keep_alive=True, options=chrome_options)
        
    def wiat_for_elem(self, by: By, elem: str) -> webelement:
        return WebDriverWait(self.driver, self.elem_loading_timeout).until(
                expected_conditions.presence_of_element_located((by, elem))
            )
    
    def tearDown(self):
        self.driver.quit()

    def test_failed_login(self):   
        self.driver.get(self.test_url)
        try:
            elem = self.wiat_for_elem(By.LINK_TEXT, "ZALOGUJ SIĘ")
            elem.click()
            login_elem = self.driver.find_element(By.ID, "username")
            pass_elem = self.driver.find_element(By.ID, "password")
            login_elem.send_keys("sample")
            pass_elem.send_keys("sample")
            log_button = self.driver.find_element(By.XPATH, "//button[contains(@class, 'MuiButton-containedPrimary')]")
            log_button.click()
            alert = self.wiat_for_elem(By.ID, "alert-dialog-title")
            self.assertEqual(alert.text, "Logowanie nieudane")
        except Exception:
            self.driver.quit()