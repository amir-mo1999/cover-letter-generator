from dotenv import load_dotenv
import os
from typing import Dict
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webdriver import WebDriver
import json
import base64
import time

load_dotenv()


# abstract scraper class
class Scraper:
    def __init__(
        self,
        wait_time: int = 5,
    ):
        """Constructor method

        Args:
            wait_time (int): explicit wait time which is passed to created webdrivers
        """

        self.driver = self._get_webdriver()
        self.wait = WebDriverWait(self.driver, wait_time)
        self.short_wait = WebDriverWait(self.driver, 2)

    def _get_webdriver(self, disable_javascript: bool = False) -> WebDriver:
        """
        Starts and return a Selenium-Webdriver instance.

        Args:
            enable_javascript (bool, optional): Defaults to False

        Returns:
            WebDriver: Webdriver instance
        """
        # set up selenium Webdriver
        selenium_url = os.environ.get("SELENIUM_URL")
        options = webdriver.ChromeOptions()
        options.add_argument("--ignore-ssl-errors=yes")
        options.add_argument("--ignore-certificate-errors")
        options.add_argument("--no-sandbox")

        profile = {}
        # disable javascript or not
        if disable_javascript:
            profile["profile.managed_default_content_settings.javascript"] = 2

        # add print and javascript options
        options.add_experimental_option("prefs", profile)

        # start driver
        return webdriver.Remote(command_executor=selenium_url, options=options)

    def _send(self, driver, cmd, params={}) -> Dict:
        """
        Executes a Chrome-Dev-Tools command in the given driver.

        Args:
            driver (WebDriver): Webdriver instance
            cmd (str): Chrome-Dev-Tools command to be executed
            params (dict, optional): additional parameters for command. Defaults to {}.

        Returns:
            Dict: Response body of the Chrome-Dev-Tools-APIs
        """
        # workaround for execute_cdp for remote drivers:
        # https://github.com/SeleniumHQ/selenium/issues/8672#issuecomment-699676869
        resource = (
            "/session/%s/chromium/send_command_and_get_result" % driver.session_id
        )
        url = driver.command_executor._url + resource
        body = json.dumps({"cmd": cmd, "params": params})
        response = driver.command_executor._request("POST", url, body)
        return response.get("value")

    ## UTIL METHODS ##
    def print_to_pdf(self, url: str, disable_javascript: bool = False) -> bytes:
        """
        Converts and returns a page under the given url as a pdf-file.

        Args:
            url (str): URL
            enable_javascript (bool, optional): Defaults to False
              Defaults to False.

        Returns:
            bytes: current webpage as a pdf-file
        """
        driver = self._get_webdriver(disable_javascript=disable_javascript)
        driver.get(url)

        pdf = self._send(
            driver,
            "Page.printToPDF",
            {
                "printBackground": True,
            },
        )
        pdf = base64.b64decode(pdf["data"])
        driver.quit()
        return pdf

    def scroll_to_end(self) -> None:
        """
        Scrolls in to end of the current webpage.
        This is useful on pages that dynamically load more content
        as we scroll down the page, to ensure all elements are loaded before scraping.
        """
        SCROLL_PAUSE_TIME = 2

        # Get scroll height
        last_height = self.driver.execute_script("return document.body.scrollHeight")

        while True:
            # Scroll down to bottom
            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);"
            )

            # Wait to load page
            time.sleep(SCROLL_PAUSE_TIME)

            # Calculate new scroll height and compare with last scroll height
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        """Quits the main driver instance."""
        self.driver.quit()

    def quit(self):
        """Quits the main driver instance."""
        self.driver.quit()
