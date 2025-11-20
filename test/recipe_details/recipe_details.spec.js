const loginActions = require("./recipe_details_actions");
const globalState = require('../globalState');
let isLoginPageScreen = true;
const password = process.env.PASSWORD;
const mobileNumber = process.env.MOBILE_NO;

describe("Login Page Test Suite Start ==>", () => {
    before(async () => {
        globalState.isSuccessful = true;
        await loginActions.ensureLoggedIn(); // Check if user is logged in or not
    })
    beforeEach('skip rest of tests cases if a tests case fails', async function () {
        if (globalState.isSuccessful) {
            if (!isLoginPageScreen) {
                this.skip();
            }
        } else {
            this.skip();
        }
    });

    it("Check Launch Screen or Not", async () => {
        await loginActions.clickOnBlUserBtn();
    });

    it("Should toggle between OTP and Password login options", async () => {
        await loginActions.toggleLoginType();
        isLoginPageScreen = loginActions.isLoginScreenTitleIsPresent();
    });

    it("Should ensure the Terms and Conditions checkbox is auto-selected", async () => {
        await loginActions.verifyTermsAndConditionsIsAutoSelected();
    });

    it("Should validate that the Get OTP button is disabled for an invalid BL number", async () => {
        await loginActions.validateInvalidBLNumberDisablesOtpButton();
    });

    it("Should validate the BL number input field accepts valid input", async () => {
        await loginActions.validateBLNumberInput(mobileNumber);
    });

    it("Should validate that the Terms and Conditions checkbox is checked", async () => {
        await loginActions.validateCheckboxState();
    });

    it("Should not allow login with an invalid password", async () => {
        await loginActions.addValueToNumberField(mobileNumber);
        await loginActions.addValueToPasswordField("InvalidPassword123");
        await loginActions.clickOnLoginBtn();
        await loginActions.checkLoginButtonForInvalidUser();
    });

    it("Should validate that the Login button is disabled for an invalid BL number", async () => {
        await loginActions.validateInvalidBLNumberDisablesLoginButton();
    });

    it("Should validate the password visibility toggle functionality", async () => {
        await loginActions.clearInputField();
        await loginActions.addValueToNumberField(mobileNumber);
        await loginActions.addValueToPasswordField(password);
        await loginActions.clickOnPassVisibleIcon();
    });

    it("Should allow login with a valid password", async () => {
        await loginActions.clickOnLoginBtn();
        await loginActions.checkLoginButtonForValidUser();
    });

    // after(async () => {
    //     require('../logout/logout.spec');
    // });

});