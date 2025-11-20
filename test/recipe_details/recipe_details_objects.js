const config = require("../../config/config");

class Objects { }

class ObjectsAndroid extends Objects {
  async myBLUserBtnElement() {
    return await driver.$(
      "id:com.arena.banglalinkmela.app:id/btnLoginRegister"
    );
  }

  async myBLNumberInputFieldElement() {
    return await driver.$("id:com.arena.banglalinkmela.app:id/etNumber");
  }

  async myBlPasswordInputFieldElement() {
    return await driver.$("id:com.arena.banglalinkmela.app:id/etPassword");
  }

  async getSkipTutorialBtnElement() {
    return driver.$("id:com.arena.banglalinkmela.app:id/iv_skip");
  }

  async getOffersModalCloseBtnElement() {
    const normalCloseBtn = await driver.$("id:com.arena.banglalinkmela.app:id/ivCloseFlashHour");
    return await normalCloseBtn;
  }

  async getLoginTypeSwitch() {
    return await driver.$("id:com.arena.banglalinkmela.app:id/switchLoginType");
  }

  async getPasswordLoginBtn() {
    return await driver.$("id:com.arena.banglalinkmela.app:id/btnLogin");
  }

  async getTermsAndPrivacyRadioBtn() {
    return await driver.$(
      "id:com.arena.banglalinkmela.app:id/cbTermsAndCondition"
    );
  }

  async termsAndConditionsCheckbox() {
    return await driver.$(
      "id:com.arena.banglalinkmela.app:id/cbTermsAndCondition"
    );
  }

  async otpButton() {
    return await driver.$("id:com.arena.banglalinkmela.app:id/btnGetOtp");
  }

  async passwordVisibleIcon() {
    return await driver.$(
      "id:com.arena.banglalinkmela.app:id/text_input_end_icon"
    );
  }

  async loginPageScreenText() {
    return await driver.$(
      "id:com.arena.banglalinkmela.app:id/tvTitle"
    );
  }

  async getOfferModal() {
    return await driver.$('id:com.arena.banglalinkmela.app:id/ivCloseFlashHour');
  }
}

class ObjectsIos extends Objects {
  async loginPageScreenText() {
    return await driver.$(
      "~Welcome to MyBL App"
    );
  }
    
  async myBLUserBtnElement() {
    return await driver.$("//XCUIElementTypeButton[@name='Banglalink User']");
  }

  async getLoginTypeSwitch() {
    return await driver.$('~Password');
  }

  async getLoginTypeSwitchToOTP() {
    return await driver.$('~OTP');
  }

  async myBLNumberInputFieldElement() {
    return await driver.$("//XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]/XCUIElementTypeOther[1]");
  }
   
  async myBlPasswordInputFieldElement() {
    return await driver.$("//XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther");
  }

  async myBlNumberInputFieldElementForOTP() {
    return await driver.$("//XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[3]/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther[1]");
  }

  async getKeyboardDoneBtn() {
    return await driver.$("~Done");
  }

  async getSkipTutorialBtnElement() {
    return await driver.$('//XCUIElementTypeButton[@name="Skip Tutorial"]');
  }

  async getOffersModalCloseBtnElement() {
    return await driver.$("com.arena.banglalinkmela.app:id/iv_skip");
  }

  async getPasswordLoginBtn() {
    return await driver.$('//XCUIElementTypeButton[@name="LOGIN"]');
  }

  async getTermsAndPrivacyRadioBtn() {
    return await driver.$(
      "//XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[3]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther/XCUIElementTypeImage"
    );
  }

  async termsAndConditionsCheckbox() {
    return await driver.$(
      "//XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[3]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther/XCUIElementTypeImage"
    );
  }

  async otpButton() {
    return await driver.$('//XCUIElementTypeButton[@name="GET OTP"]');
  }

  async passwordVisibleIcon() {
    return await driver.$(
      '//XCUIElementTypeButton[@name="Button"]'
    );
  }

  async afterLoginContactAccess() {
    return await driver.$('~OK');
  }

  async afterLoginDonotSavePassword() {
    return await driver.$('~Not Now');
  }

  async getCheckedTermsAndConditions() {
    return await driver.$('~green-tick-icon');
  }

  async getUnCheckedTermsAndConditions() {
    return await driver.$('(//XCUIElementTypeImage[@name="tick_icon_deselected"])[2]');
  }

  async getOfferModal() {
    return await driver.$('//XCUIElementTypeButton[@name="new search"]/parent::*/parent::*');
  }
}
 
module.exports =
  config.getCurrentPlatform() === "Android"
    ? new ObjectsAndroid()
    : new ObjectsIos();