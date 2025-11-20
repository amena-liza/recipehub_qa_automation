const config = require('../../config/config')

class CommonObjects {
}

class CommonObjectsAndroid extends CommonObjects {
    async backFromSearchPage() {
        return $('id:com.arena.banglalinkmela.app:id/text_input_start_icon');
    }
    async getSmsBtn() {
        return $('id:com.arena.banglalinkmela.app:id/tvSMSTitle');
    }
    async getNavHomeBtn() {
        return $('id:com.arena.banglalinkmela.app:id/navigation_connect');
    }
    async upArrowIcon() {
        //Dont tuch this selector
        return $(`~Navigate up`);
    }

    get navBarBackBtn() {
        return $('~Back');
    }

    getXpathOfTextViewByText(text) {
        return `//android.widget.TextView[contains(translate(@text, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${text.toLowerCase()}')]`;
    }

    async getTextViewByText(text) {
        return $(this.getXpathOfTextViewByText(text));
    }

    async getTextViewContainingText(text) {
        return $(`//android.widget.TextView[contains(translate(@text, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${text.toLowerCase()}')]`);
    }

    async getHamburgerMenuElement() {
        return $('(//android.widget.ImageView[@resource-id="com.arena.banglalinkmela.app:id/ivSearch"])[2]');
        // return $("id=com.arena.banglalinkmela.app:id/action_hamburger");
    }

    async getNavDrawerCloseBtnElement() {
        return $('id=com.arena.banglalinkmela.app:id/drawerCloseIconView');
    }

    async getBottomTabHomeBtn() {
        return $('~Home');
    }

    get confirmBtn() {
        return $("id:com.arena.banglalinkmela.app:id/btnBuy");
    }

    get makePaymentConfirmation1() {
        return $('//android.widget.TextView[@text="Make Payment"]');
    }

    get makePaymentConfirmation2() {
        return $("id:com.arena.banglalinkmela.app:id/layout_pay");
    }

    async getSearchElement() {
        return await $("id:com.arena.banglalinkmela.app:id/action_search");
    }

    async getNotificationsElement() {
        return await $("id:com.arena.banglalinkmela.app:id/action_notification");
    }

    async getHamburgerMenuElement() {
        return await $("id:com.arena.banglalinkmela.app:id/action_hamburger");
    }
    async getOfferModal() {
        return await driver.$('id:com.arena.banglalinkmela.app:id/ivCloseFlashHour');
    }
}

class CommonObjectsIos extends CommonObjects {

    async getSmsBtn() {
        return $('~SMS');
    }
    async getNavHomeBtn() {
        return $('~home');
    }
    async navigateBackFromamarOffer() {
        return $('~arrow left black');
    }
    async navigateBackFromBkashPage() {
        return await driver.$('~Close');
    }

    async navigateBackFromBkashAddPage() {
        return await $('~arrow-left-black');
    }
    async rechargePageBackBtn() {
        return $('~black_arrow_left_icon');
    }
    async backFromSearchPage() {
        return $('//XCUIElementTypeButton[@name="Cancel"]');
    }
    async menuClose(){
        return $(`~menu cross`);
    }
    async closeAlert() {
        return $('~Ok');
    }
    async getSearchElement() {
        return await driver.$(
            '~new search'
        );
    }
    async getNotificationsElement() {
        return await driver.$(
            '~new notification'
        );
    }
    async getHamburgerMenuElement() {
        return $("~new home menu");
    }

    async upArrowIcon() {
        return $(`~black_arrow_left_icon`);
    }

    get iconBackGray() {
        return $(`~icon back gray`);
    }

    async getTextViewByText(text) {
        return $(`//XCUIElementTypeStaticText[@value="${text}"]`);
    }

    async getTextViewContainingText(text) {
        return $("//XCUIElementTypeStaticText[contains(@value, '" + text + "')]")
    }

    async getTextViewByAccessibilityId(text) {
        return $(`~${text}`);
    }

    async getButtonByText(text) {
        return $('//XCUIElementTypeButton[@name="' + text + '"]');
    }

    async getButtonContainingText(text) {
        return $("//XCUIElementTypeButton[contains(@value, '" + text + "')]")
    }



    get specificScreenTitle() {

        return $('//XCUIElementTypeButton[@name="ic left arrow black"]/parent::*/following-sibling::XCUIElementTypeStaticText');

    }

    get navBarBackBtn() {
        return $('~ic left arrow black');
    }


    async getNavDrawerCloseBtnElement() {
        return $('~menu cross');
    }

    async getBottomTabHomeBtn() {
        return $('~home');
    }

    async getBottomTabSelectedHomeBtn() {
        return $('~home-selected');
    }

    get confirmBtn() {
        return $('//XCUIElementTypeButton[@name="Confirm"]');
    }

    get makePaymentConfirmation1() {
        return $(`~Banglalink App`);
    }

    get makePaymentConfirmation2() {
        return $('(//XCUIElementTypeStaticText[@name="Make Payment"])[1]');
    }

    get backFromPayment() {
        return $('//XCUIElementTypeApplication[@name="MyBL"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther[2]/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeImage');
    }

    get crossBtn() {
        return $(`~close`);
    }

    get ok() {
        return $(`~Ok`);
    }
    async getOfferModal() {
        return await driver.$('//XCUIElementTypeButton[@name="new search"]/parent::*/parent::*');
    }

}

module.exports = config.getCurrentPlatform() === 'Android' ? new CommonObjectsAndroid() : new CommonObjectsIos();
