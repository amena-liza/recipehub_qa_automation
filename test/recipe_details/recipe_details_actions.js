const { expect } = require("chai");
const report = require("@wdio/allure-reporter");
const config = require("../../config/config");
const loginObjects = require("./recipe_details_objects");
const globalState = require("../globalState");

let loginScreenTitleIsPresent;

class Actions {
  isLoginScreenTitleIsPresent() {
    return loginScreenTitleIsPresent;
  }

  async checkLoginPage() {
    try {
      const button = await loginObjects.myBLUserBtnElement();
      await button.waitForDisplayed({ timeout: 10000 });
      return await button.isDisplayed();
    } catch (error) {
      console.error("Login button not found or page not loaded correctly:", error.message);
      await report.step(`Login button not found or page not loaded correctly: ${error.message}`, () => {});
      return false;
    }
  }

  async toggleLoginType() {
    try {
      const LoginScreenTextElement = await loginObjects.loginPageScreenText();
      loginScreenTitleIsPresent = await LoginScreenTextElement.isDisplayed();
      expect(loginScreenTitleIsPresent).to.equal(true, "Login screen title should be visible");

      const toggleBtn = await loginObjects.getLoginTypeSwitch();
      await toggleBtn.waitForDisplayed({ timeout: 60000 });
      expect(await toggleBtn.isDisplayed()).to.be.true, "Login type toggle button should be visible";
      await toggleBtn.click();
      await driver.pause(5000);
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to toggle login type: ${error.message}`, () => {});
      throw error;
    }
  }

  async handleError(errorMessage, error) {
    globalState.isSuccessful = false;
    globalState.isLoginSuccess = false;
    await report.step(`${errorMessage}: ${error.message}`, () => {});
    throw error;
  }
}

class ActionsAndroid extends Actions {
  async waitAndVerifyElement(element, timeout = 10000) {
    try {
      await element.waitForDisplayed({ timeout });
      return await element.isDisplayed();
    } catch (error) {
      await report.step(`Failed to wait for and verify element: ${error.message}`, () => {});
      return false;
    }
  }

  async clickElement(element, errorMessage) {
    try {
      expect(await element.isDisplayed()).to.be.true, "Element should be visible before clicking";
      await element.click();
    } catch (error) {
      await this.handleError(errorMessage, error);
    }
  }

  async addValueToField(field, value, errorMessage) {
    try {
      await field.addValue(value);
    } catch (error) {
      await this.handleError(errorMessage, error);
    }
  }

  async verifyTermsAndConditionsIsAutoSelected() {
    try {
      const termsPrivacyCheckbox = await loginObjects.getTermsAndPrivacyRadioBtn();
      const isChecked = await termsPrivacyCheckbox.getAttribute("checked");

      if (!isChecked) {
        await this.clickTermsPrivacyRadioBtn();
        expect(await termsPrivacyCheckbox.getAttribute("checked")).to.be.true,
          "Terms and privacy checkbox should be checked after clicking";
      }
    } catch (error) {
      await report.step(`Failed to verify terms and conditions auto-selection: ${error.message}`, () => {});
      await this.handleError("Failed to verify terms and conditions auto-selection", error);
    }
  }

  async clickOnBlUserBtn() {
    try {
      const button = await loginObjects.myBLUserBtnElement();
      await this.waitAndVerifyElement(button, 60000);
      await button.click();
    } catch (error) {
      await this.handleError("Failed to click on Banglalink User", error);
    }
  }

  async clickOnLoginBtn() {
    const button = await loginObjects.getPasswordLoginBtn();
    await this.clickElement(button, "Failed to click on login button");
  }

  async addValueToNumberField(phoneNumber) {
    const field = await loginObjects.myBLNumberInputFieldElement();
    await this.addValueToField(
      field,
      phoneNumber,
      "Failed to add value on number field"
    );
  }

  async addValueToPasswordField(password) {
    const field = await loginObjects.myBlPasswordInputFieldElement();
    await this.addValueToField(
      field,
      password,
      "Failed to add value on blLoginWithPassword field"
    );
  }

  async clearInputField() {
    try {
      const numberField = await loginObjects.myBLNumberInputFieldElement();
      const passwordField = await loginObjects.myBlPasswordInputFieldElement();
      await numberField.setValue("");
      await passwordField.setValue("");
    } catch (error) {
      await report.step(`Failed to clear input field: ${error.message}`, () => {});
      await this.handleError("Failed to clear input field", error);
    }
  }

  async ensureLoggedIn() {
    try {
      return;
    } catch (error) {
      await report.step(`Failed to ensure user is logged in: ${error.message}`, () => {});
      throw error;
    }
  }

  async clickTermsPrivacyRadioBtn() {
    const button = await loginObjects.getTermsAndPrivacyRadioBtn();
    await this.clickElement(button, "Failed to click on terms privacy radio button");
  }

  async checkLoginButtonForInvalidUser() {
    try {
      const loginButton = await loginObjects.getPasswordLoginBtn();
      expect(await loginButton.isDisplayed()).to.equal(true, "Login button should be visible for invalid user");
    } catch (error) {
      await report.step(`Failed to check login button for invalid user: ${error.message}`, () => {});
      await this.handleError("Failed to check login button for invalid user", error);
    }
  }

  async checkLoginButtonForValidUser() {
    try {
      await browser.pause(5000);
      const loginButton = await loginObjects.getPasswordLoginBtn();
      expect(await loginButton.isDisplayed()).to.equal(false, "Login button should not be visible after successful login");
      await driver.pause(5000);
      try {
        const getSkipButton = await loginObjects.getSkipTutorialBtnElement();
        await getSkipButton.waitForDisplayed({ timeout: 50000 });
        if (await getSkipButton.isDisplayed()) {
          await getSkipButton.click();
        }
      } catch (error) {
        await report.step(`No Skip Button found: ${error.message}`, () => {});
        console.warn("No Skip Button found.");
      }
      try {
        const getOfferModal = await loginObjects.getOfferModal();
        await getOfferModal.waitForDisplayed({ timeout: 50000 });
        if (await getOfferModal.isDisplayed()) {
          await getOfferModal.click();
        }
      } catch (error) {
        await report.step(`No Offer Modal found: ${error.message}`, () => {});
        console.warn("No Offer Modal found.");
      }
    } catch (error) {
      await report.step(`Failed to check login button for valid user: ${error.message}`, () => {});
      await this.handleError("Failed to check login button for valid user", error);
    }
  }

  async validateInvalidBLNumberDisablesOtpButton() {
    try {
      await this.toggleLoginType();
      const inputField = await loginObjects.myBLNumberInputFieldElement();
      const invalidInputValue = "01991435";

      await inputField.setValue(invalidInputValue);
      const otpButton = await loginObjects.otpButton();
      expect(await otpButton.isEnabled()).to.equal(false, "OTP button should be disabled with invalid BL number");
    } catch (error) {
      await report.step(`Failed to check if invalid BL number disables OTP button: ${error.message}`, () => {});
      await this.handleError("Failed to check if invalid BL number disables OTP button", error);
    }
  }

  async validateBLNumberInput(mobileNumber) {
    try {
      const inputField = await loginObjects.myBLNumberInputFieldElement();
      await inputField.setValue(mobileNumber);
      const startsWith019 = mobileNumber.startsWith("019") || mobileNumber.startsWith("014");
      const is11Digits = /^\d{11}$/.test(mobileNumber);

      expect(startsWith019).to.equal(true, "Mobile number should start with 019 or 014");
      expect(is11Digits).to.equal(true, "Mobile number should be exactly 11 digits");
      await this.toggleLoginType();
    } catch (error) {
      await report.step(`Failed to validate Banglalink number input: ${error.message}`, () => {});
      await this.handleError("Failed to validate Banglalink number input", error);
    }
  }

  async validateCheckboxState() {
    try {
      const termsCheckbox = await loginObjects.termsAndConditionsCheckbox();
      const isChecked = (await termsCheckbox.isSelected()) ||
                       (await termsCheckbox.getAttribute("checked")) === "true";
      expect(isChecked).to.equal(true, "Terms and conditions checkbox should be checked by default");
    } catch (error) {
      await report.step(`Failed to validate checkbox state: ${error.message}`, () => {});
      await this.handleError("Failed to validate checkbox state", error);
    }
  }

  async validateInvalidBLNumberDisablesLoginButton() {
    try {
      const field = await loginObjects.myBLNumberInputFieldElement();
      await this.waitAndVerifyElement(field);

      await field.addValue("01991435");
      await this.addValueToPasswordField("Admin123");

      const loginButton = await loginObjects.getPasswordLoginBtn();
      expect(await loginButton.isEnabled()).to.equal(false, "Login button should be disabled with invalid BL number");
      await browser.pause(2000);
    } catch (error) {
      await report.step(`Failed to validate invalid BL number disables login button: ${error.message}`, () => {});
      await this.handleError("Failed to validate invalid BL number disables login button", error);
    }
  }

  async clickOnPassVisibleIcon() {
    try {
      const visibleIcon = await loginObjects.passwordVisibleIcon();
      await this.clickElement(visibleIcon, "Failed to click on blLoginWithPassword visible icon");
      await browser.pause(2000);
    } catch (error) {
      await report.step(`Failed to click on password visible icon: ${error.message}`, () => {});
      await this.handleError("Failed to click on blLoginWithPassword visible icon", error);
    }
  }

}

class ActionsIos extends Actions {
  async clickOnBlUserBtn() {
    try {
      const button = await loginObjects.myBLUserBtnElement();
      await button.click();
    } catch (error) {
      await report.step(`Failed to click on Banglalink User button: ${error.message}`, () => {});
      await this.handleError("Failed to click on Banglalink User button", error);
    }
  }

  async toggleLoginTypeToOTP() {
    try {
      const toggleBtn = await loginObjects.getLoginTypeSwitchToOTP();
      return await toggleBtn.click();
    } catch (error) {
      await report.step(`Failed to toggle login type to OTP: ${error.message}`, () => {});
      await this.handleError("Failed to toggle login type to OTP", error);
    }
  }

  async validateInvalidBLNumberDisablesOtpButton() {
    try {
      await this.toggleLoginTypeToOTP();
      const inputField = await loginObjects.myBlNumberInputFieldElementForOTP();

      const invalidInputValue = "01991435";
      await inputField.setValue(invalidInputValue);
      const getKeyboardDoneBtn = await loginObjects.getKeyboardDoneBtn();
      await getKeyboardDoneBtn.click();
      const OTPButton = await loginObjects.otpButton();

      const backspaces = Array(20).fill("\u0008").join("");
      await inputField.setValue(backspaces);

      await getKeyboardDoneBtn.click();
      const isEnabled = await OTPButton.isEnabled();

      expect(isEnabled).to.equal(false, "OTP button should be disabled with invalid BL number");
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to validate invalid BL number disables OTP button: ${error.message}`, () => {});
    }
  }

  async validateBLNumberInput(mobileNumber) {
    try {
      const inputField = await loginObjects.myBLNumberInputFieldElement();
      await inputField.setValue(mobileNumber);
      const getKeyboardDoneBtn = await loginObjects.getKeyboardDoneBtn();
      await getKeyboardDoneBtn.click();

      const startsWith019 = mobileNumber.startsWith("019") || mobileNumber.startsWith("014");
      const is11Digits = /^\d{11}$/.test(mobileNumber);

      expect(startsWith019).to.equal(true, "Mobile number should start with 019 or 014");
      expect(is11Digits).to.equal(true, "Mobile number should be exactly 11 digits");
      const backspaces = Array(20).fill("\u0008").join("");
      await inputField.setValue(backspaces);

      await getKeyboardDoneBtn.click();
      await this.toggleLoginType();
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to validate BL number input: ${error.message}`, () => {});
    }
  }

  async addValueToNumberField(phoneNumber) {
    try {
      const field = await loginObjects.myBLNumberInputFieldElement();
      await field.addValue(phoneNumber);
      const getKeyboardDoneBtn = await loginObjects.getKeyboardDoneBtn();
      await getKeyboardDoneBtn.click();
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to add value to number field: ${error.message}`, () => {});
    }
  }

  async addValueToPasswordField(password) {
    try {
      const field = await loginObjects.myBlPasswordInputFieldElement();
      await field.addValue(password);
      const getKeyboardDoneBtn = await loginObjects.getKeyboardDoneBtn();
      await getKeyboardDoneBtn.click();
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to add value to password field: ${error.message}`, () => {});
    }
  }

  async clearInputField() {
    try {
      const field = await loginObjects.myBLNumberInputFieldElement();
      const field2 = await loginObjects.myBlPasswordInputFieldElement();
      const backspaces = Array(20).fill("\u0008").join("");
      await field.setValue(backspaces);
      const getKeyboardDoneBtn = await loginObjects.getKeyboardDoneBtn();
      await getKeyboardDoneBtn.click();

      await field2.setValue(backspaces);
      await getKeyboardDoneBtn.click();
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to clear input fields: ${error.message}`, () => {});
    }
  }

  async checkLoginButtonForInvalidUser() {
    try {
      const loginButton = await loginObjects.getPasswordLoginBtn();
      const isLoginButtonVisible = await loginButton.isDisplayed();
      expect(isLoginButtonVisible).to.equal(true, "Login button should be visible for invalid user");
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to check login button for invalid user: ${error.message}`, () => {});
    }
  }

  async validateInvalidBLNumberDisablesLoginButton() {
    try {
      const inputField = await loginObjects.myBLNumberInputFieldElement();
      const backspaces = Array(20).fill("\u0008").join("");

      await inputField.setValue(backspaces);
      const getKeyboardDoneBtn = await loginObjects.getKeyboardDoneBtn();
      await getKeyboardDoneBtn.click();
      const field = await loginObjects.myBLNumberInputFieldElement();
      await field.addValue("01991435");
      await this.addValueToPasswordField("Admin123");

      const LoginButton = await loginObjects.getPasswordLoginBtn();
      const isEnabled = await LoginButton.isEnabled();

      expect(isEnabled).to.equal(false, "Login button should be disabled with invalid BL number");
      await browser.pause(2000);
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to validate invalid BL number disables login button: ${error.message}`, () => {});
    }
  }

  async clickOnPassVisibleIcon() {
    try {
      const visibleIcon = await loginObjects.passwordVisibleIcon();
      await visibleIcon.waitForDisplayed({ timeout: 10000 });
      expect(await visibleIcon.isDisplayed()).to.be.true, "Password visibility icon should be visible";

      await visibleIcon.click();
      await browser.pause(2000);
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to click on password visibility icon: ${error.message}`, () => {});
    }
  }

  async clickOnLoginBtn() {
    try {
      const button = await loginObjects.getPasswordLoginBtn();
      expect(await button.isDisplayed()).to.be.true, "Login button should be visible before clicking";
      await button.click();
      await browser.pause(3000);
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to click on login button: ${error.message}`, () => {});
    }
  }

  async checkLoginButtonForValidUser() {
    try {
      await browser.pause(5000);
      const loginButton = await loginObjects.getPasswordLoginBtn();
      const isLoginButtonVisible = await loginButton.isDisplayed();
      expect(isLoginButtonVisible).to.equal(false, "Login button should not be visible after successful login");
      await this.verifyLoginSuccess();
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to check login button for valid user: ${error.message}`, () => {});
      await this.handleError("Failed to check login button for valid user", error);
    }
  }

  async verifyTermsAndConditionsIsAutoSelected() {
    try {
      const termsPrivacyCheckboxChecked = await loginObjects.getCheckedTermsAndConditions();
      expect(await termsPrivacyCheckboxChecked.isDisplayed()).to.be.true,
        "Terms and conditions checkbox should be selected by default";
    } catch (error) {
      await report.step(`Failed to verify terms and conditions auto-selection: ${error.message}`, () => {});
      await this.handleError("Failed to verify terms and conditions auto-selection", error);
    }
  }

  async clickTermsPrivacyRadioBtn() {
    try {
      const termsAndConditionsCheckboxUnchecked = await loginObjects.getUnCheckedTermsAndConditions();
      await termsAndConditionsCheckboxUnchecked.click();
    } catch (error) {
      await report.step(`Failed to click terms privacy radio button: ${error.message}`, () => {});
      await this.handleError("Failed to click terms privacy radio button", error);
    }
  }

  async validateCheckboxState() {
    try {
      const termsPrivacyCheckboxChecked = await loginObjects.getCheckedTermsAndConditions();
      const isChecked = await termsPrivacyCheckboxChecked.isDisplayed();
      if (!isChecked) {
        await this.clickTermsPrivacyRadioBtn();
        expect(await termsPrivacyCheckboxChecked.isDisplayed()).to.be.true,
          "Terms and conditions checkbox should be checked after clicking";
      }
    } catch (error) {
      globalState.isSuccessful = false;
      globalState.isLoginSuccess = false;
      await report.step(`Failed to validate checkbox state: ${error.message}`, () => {});
    }
  }

  async verifyLoginSuccess() {
    try {
      const afterLoginDonotSavePassword = await loginObjects.afterLoginDonotSavePassword();
      if (await afterLoginDonotSavePassword.isDisplayed()) {
        await afterLoginDonotSavePassword.click();
      }
    } catch (error) {
      await report.step(`No 'Don't Save Password' popup found: ${error.message}`, () => {});
      console.warn("No 'Don't Save Password' popup found.");
    }
    await driver.pause(5000);
    try {
      const getOfferModal = await loginObjects.getOfferModal();
      if (await getOfferModal.isDisplayed()) {
        await getOfferModal.click();
        await driver.pause(3000);
      }
    } catch (error) {
      await report.step(`No Offer Modal found: ${error.message}`, () => {});
      console.warn("No Offer Modal found.");
    }
  }

  async ensureLoggedIn() {
    try {
      const isLoggedIn = await this.checkLoginPage();
      if (!isLoggedIn) {
        console.log("User is logged in. Logging out the user and running the test...");
        await require("../logout/logoutActions").logoutUser();
      }
      return true;
    } catch (error) {
      await report.step(`Error checking login status: ${error.message}`, () => {});
      console.error("Error checking login status:", error.message);
      throw error;
    }
  }

  }
  
  module.exports = 
    config.getCurrentPlatform() === "Android"
      ? new ActionsAndroid()
      : new ActionsIos();