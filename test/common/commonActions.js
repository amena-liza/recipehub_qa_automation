const config = require("../../config/config");
const commonObjects = require('./commonObject');
const expect = require('chai').expect;
const assert = require("assert");
const globalState = require('../globalState');

class CommonActions {

    async goBackToHomePage() {
        let isHomePageDisplayed = await this.isHomePageDisplayed();


        while (!isHomePageDisplayed) {
            const isBackIconVisible = await this.clickBackIcon();
            isHomePageDisplayed = await this.isHomePageDisplayed();

            if (!isBackIconVisible && !isHomePageDisplayed) {
                const getNavHomeBtn = await commonObjects.getNavHomeBtn();
                if (getNavHomeBtn && await getNavHomeBtn.isDisplayed()) {
                    await getNavHomeBtn.click();
                } else {
                    const isLoginPageScreen = await loginObjects.myBLUserBtnElement();
                    if (await isLoginPageScreen && await isLoginPageScreen.isDisplayed()) {
                        await loginActions.loginFunction();
                    }
                }
            }

            // Re-check after clicking home/back
            isHomePageDisplayed = await this.isHomePageDisplayed();


            if (isHomePageDisplayed) {
                const getSmsBtn = await commonObjects.getSmsBtn();

                if (getSmsBtn && await getSmsBtn.isDisplayed()) {
                    isHomePageDisplayed = true;
                } else {

                    let maxScrolls = 5;
                    let smsBtnFound = false;

                    while (maxScrolls-- > 0 && !smsBtnFound) {
                        const getSmsBtn = await commonObjects.getSmsBtn();

                        if (getSmsBtn && await getSmsBtn.isDisplayed()) {
                            smsBtnFound = true;
                            break;
                        }

                        await this.bareScrollToTop();
                        await driver.pause(3000); // Allow UI to update
                    }

                    if (!smsBtnFound) {
                        isHomePageDisplayed = false;
                    }
                }
            }
        }
        if (isHomePageDisplayed) {
            console.log("Home page is visible. Checking if SMS button is visible...");
            const getSmsBtn = await commonObjects.getSmsBtn();

            if (getSmsBtn && await getSmsBtn.isDisplayed()) {
                console.log("SMS button is visible. Home page is displayed.");
                isHomePageDisplayed = true;
            } else {
                console.log("SMS button is not visible. Scrolling up...");

                let maxScrolls = 5;
                let smsBtnFound = false;

                while (maxScrolls-- > 0 && !smsBtnFound) {
                    console.log("Scrolling up...");
                    const getSmsBtn = await commonObjects.getSmsBtn();

                    if (getSmsBtn && await getSmsBtn.isDisplayed()) {
                        console.log("SMS button is visible. Home page is displayed.");
                        smsBtnFound = true;
                        break;
                    }

                    await this.bareScrollToTop();

                    await driver.pause(1000); // Allow UI to update
                }

                if (!smsBtnFound) {
                    console.log("SMS button is not visible after scrolling up. Home page is not displayed.");
                    isHomePageDisplayed = false;
                }
            }
        }
    }

    async landOnHomePage() {
        // close the hamburger if it is open
        await this.closeTheNavDrawerIfVisibleInUi();
        // Click on bottom nav home button
        await this.clickOnBottomNavHomeButton();
    }

    async scrollVerticallyUntilElementVisible(recyclerViewId, targetElementId, maxScrolls = 20, scrollByPixels = 600) {
        try {
            // Locate the RecyclerView element
            const recyclerView = await driver.$(
                `android=new UiSelector().resourceId("${recyclerViewId}")`
            );

            let elementVisible = false;
            let scrollCount = 0;

            while (!elementVisible && scrollCount < maxScrolls) {
                try {
                    // Locate the target element
                    const targetElement = await driver.$(
                        `android=new UiSelector().resourceId("${targetElementId}")`
                    );

                    // Check if the target element is visible
                    elementVisible = await targetElement.isDisplayed();

                    if (elementVisible) {
                        break;
                    }
                } catch (error) {
                    throw error;
                }

                // Perform the scroll
                const recyclerViewLocation = await recyclerView.getLocation();
                const recyclerViewSize = await recyclerView.getSize();

                const startY = Math.round(recyclerViewLocation.y + (recyclerViewSize.height * 0.9));
                const endY = Math.max(startY - scrollByPixels, recyclerViewLocation.y);
                const centerX = Math.round(recyclerViewLocation.x + (recyclerViewSize.width / 2));

                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 600, x: centerX, y: endY },
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);

                await driver.pause(500); // Allow time for scrolling to complete
                scrollCount++;
            }

            if (!elementVisible) {
                console.error(`Failed to find element ${targetElementId} after ${maxScrolls} scrolls.`);
                return false;
            }

            return true; // Element found and visible
        } catch (error) {
            console.error(`Error during vertical scrolling: ${error.message}`);
            throw error;
        }
    }

    /*async scrollVerticallyToTop(recyclerViewId, maxScrolls = 20, scrollByPixels = 100) {
        try {
            // Locate the RecyclerView element
            const recyclerView = await driver.$(
                `android=new UiSelector().resourceId("${recyclerViewId}")`
            );

            let scrollCount = 0;

            while (scrollCount < maxScrolls) {
                // Perform the scroll
                const recyclerViewLocation = await recyclerView.getLocation();
                const recyclerViewSize = await recyclerView.getSize();

                const startY = Math.round(recyclerViewLocation.y + (recyclerViewSize.height * 0.1)); // Near the top
                const endY = Math.min(startY + scrollByPixels, recyclerViewLocation.y + recyclerViewSize.height);
                const centerX = Math.round(recyclerViewLocation.x + (recyclerViewSize.width / 2));

                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 600, x: centerX, y: endY },
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);

                await driver.pause(500); // Allow time for scrolling to complete
                scrollCount++;
            }
            return true;
        } catch (error) {
            console.error(`Error during vertical scrolling to the top: ${error.message}`);
            throw error;
        }
    }*/

    async scrollVerticallyUntilElementVisible(recyclerViewId, targetElementId, maxScrolls = 20, scrollByPixels = 600) {
        try {
            // Locate the RecyclerView element
            const recyclerView = await driver.$(
                `android=new UiSelector().resourceId("${recyclerViewId}")`
            );

            let elementVisible = false;
            let scrollCount = 0;

            while (!elementVisible && scrollCount < maxScrolls) {
                try {
                    // Locate the target element
                    const targetElement = await driver.$(
                        `android=new UiSelector().resourceId("${targetElementId}")`
                    );

                    // Check if the target element is visible
                    elementVisible = await targetElement.isDisplayed();

                    if (elementVisible) {
                        break;
                    }
                } catch (error) {
                    throw error;
                }

                // Perform the scroll
                const recyclerViewLocation = await recyclerView.getLocation();
                const recyclerViewSize = await recyclerView.getSize();

                const startY = Math.round(recyclerViewLocation.y + (recyclerViewSize.height * 0.9));
                const endY = Math.max(startY - scrollByPixels, recyclerViewLocation.y);
                const centerX = Math.round(recyclerViewLocation.x + (recyclerViewSize.width / 2));

                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 600, x: centerX, y: endY },
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);

                await driver.pause(500); // Allow time for scrolling to complete
                scrollCount++;
            }

            if (!elementVisible) {
                return false;
            }

            return true; // Element found and visible
        } catch (error) {
            console.error(`Error during vertical scrolling: ${error.message}`);
            throw error;
        }
    }

    async scrollVerticallyToTop(recyclerViewId, maxScrolls = 20, scrollByPixels = 100) {
        try {
            // Locate the RecyclerView element
            const recyclerView = await driver.$(
                `android=new UiSelector().resourceId("${recyclerViewId}")`
            );

            let scrollCount = 0;

            while (scrollCount < maxScrolls) {
                // Perform the scroll
                const recyclerViewLocation = await recyclerView.getLocation();
                const recyclerViewSize = await recyclerView.getSize();

                const startY = Math.round(recyclerViewLocation.y + (recyclerViewSize.height * 0.1)); // Near the top
                const endY = Math.min(startY + scrollByPixels, recyclerViewLocation.y + recyclerViewSize.height);
                const centerX = Math.round(recyclerViewLocation.x + (recyclerViewSize.width / 2));

                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 600, x: centerX, y: endY },
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);

                await driver.pause(500); // Allow time for scrolling to complete
                scrollCount++;
            }
            return true;
        } catch (error) {
            console.error(`Error during vertical scrolling to the top: ${error.message}`);
            throw error;
        }
    }

    async scrollElementToLeft(elementSelector, percentageToSwipe = 100) {
        try {
            // Wait for element to be present
            const element = await $(elementSelector);
            await element.waitForDisplayed({ timeout: 20000 });

            // Get element location and size
            const elementLocation = await element.getLocation();
            const elementSize = await element.getSize();

            // Calculate swipe coordinates
            const startX = Math.round(elementLocation.x + (elementSize.width * 0.9)); // Start from 90% of width
            const endX = Math.round(elementLocation.x + (elementSize.width * (0.9 - (percentageToSwipe / 100))));
            const centerY = Math.round(elementLocation.y + (elementSize.height / 2));

            // Perform the swipe using the newer WebdriverIO gesture commands
            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: centerY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: endX, y: centerY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);

            // Wait for animation to complete
            await driver.pause(500);
        } catch (error) {
            console.error(`Failed to perform left swipe: ${error.message}`);
            throw error;
        }
    }

    async scrollElementToRight(elementSelector, percentageToSwipe = 100) {
        try {
            const element = await $(elementSelector);
            await element.waitForDisplayed({ timeout: 10000 });

            const elementLocation = await element.getLocation();
            const elementSize = await element.getSize();

            const startX = Math.round(elementLocation.x + (elementSize.width * 0.1));  // Start at 10% of width
            const endX = Math.round(elementLocation.x + (elementSize.width * (0.1 + (percentageToSwipe / 100))));
            const centerY = Math.round(elementLocation.y + (elementSize.height / 2));

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: centerY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: endX, y: centerY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);

            await driver.pause(500);
        } catch (error) {
            console.error(`Failed to perform right scroll: ${error.message}`);
            throw error;
        }
    }

    // Returns xpath index of current UI
    /*async scrollVerticallyForClickOnApiElement(recyclerViewId, elementXpath, indexAPI = 1, maxScrolls = 20) {

        try {
            const recyclerView = await driver.$(
                `android=new UiSelector().resourceId("${recyclerViewId}")`
            );

            let elementVisible = false;
            let scrollCount = 0, index = 0, elementId, firstElement = '0000', found = false, indexUi, returnUiIndex;

            const recyclerViewSize = await recyclerView.getSize();
            const scrollByPixels = recyclerViewSize.height - (recyclerViewSize.height / 2);

            while (!elementVisible && scrollCount < maxScrolls) {

                indexUi = 0;

                for (let i = 1; i <= 100; i++) {
                    const element = $(`(${elementXpath})[${i}]`);
                    const isVisible = await element?.isDisplayed();

                    if (isVisible) {
                        indexUi++;
                        index++;
                        elementId = await element.elementId;
                        if (elementId == firstElement) {
                            index -= indexUi;
                        }
                        if (index === indexAPI) {
                            returnUiIndex = indexUi;
                            found = true;
                        }
                    } else {
                        break;
                    }
                }
                firstElement = elementId;

                if (found) {
                    break;
                }

                const recyclerViewLocation = await recyclerView.getLocation();
                const recyclerViewSize = await recyclerView.getSize();

                const startY = Math.round(recyclerViewLocation.y + (recyclerViewSize.height * 0.9));
                const endY = Math.max(startY - scrollByPixels, recyclerViewLocation.y);
                const centerX = Math.round(recyclerViewLocation.x + (recyclerViewSize.width / 2));

                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 600, x: centerX, y: endY },
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);

                await driver.pause(100);
                scrollCount++;
            }

            if (found) {
                return returnUiIndex;
            }

        } catch (error) {
            console.error(`Error during vertical scrolling: ${error.message}`);
            throw error;
        }
    }*/

    async loginTillFlashHourModalScreen() {
        try {
            await loginActions.clickOnBlUserBtn();

            await loginActions.toggleLoginType();

            await loginActions.addValueToNumberField(mobileNumber);

            await loginActions.addValueToPasswordField(password);

            const termsPrivacyBtn = await loginObjects.getTermsAndPrivacyRadioBtn();
            if (!(await termsPrivacyBtn.getAttribute("checked"))) {
                await loginActions.clickTermsPrivacyRadioBtn();
                expect(await termsPrivacyBtn.getAttribute("checked")).to.be.true;
            }

            const loginBtn = await loginObjects.getPasswordLoginBtn();
            expect(await loginBtn.isEnabled()).to.be.true;

            await loginActions.clickOnLoginBtn();

            await this.waitForSeconds(1);

            await loginActions.clickSkipTutorial();
        } catch (error) {
            globalState.isLoginSuccess = false;
        }
    }

    async waitForSeconds(seconds) {
        await driver.pause(seconds * 1000);
    }

    async scrollRightHorizontallyToElement(element, container) {
        const MAX_SWIPES = 10; // Maximum number of swipes to prevent infinite scrolling

        for (let i = 0; i < MAX_SWIPES; i++) {
            // Check if the element is present within the container
            const isElementVisible = await element.isDisplayed();
            if (isElementVisible) {
                return true;
            }

            // Get the container's size and location
            const containerElement = await $(container);
            const { x, y, width, height } = await containerElement.getRect();

            // Calculate swipe start and end points
            const startX = x + width * 0.8; // Start near the right edge
            const endX = x + width * 0.2;  // End near the left edge
            const startY = y + height / 2; // Middle of the container vertically

            // Perform swipe action using performActions
            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 200 },
                        { type: 'pointerMove', duration: 600, x: endX, y: startY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);

            // Wait for UI to stabilize after swipe
            await driver.pause(500);
        }

        throw new Error('Element not found after horizontally scrolling to the right!');
    }

    async scrollAndFindByText(text) {
        return $(`android= new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("${text}")`);
    }

    capitalizeFirstLetters(str) {
        // Split the string into words
        const words = str.split(' ');

        // Capitalize each word
        const capitalizedWords = words.map(word => {
            // Convert first character to uppercase, rest to lowercase
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });

        // Join the words back together
        return capitalizedWords.join(' ');
    }

    async clickHamburgerMenu() {
        const hamburgerMenuElement = await commonObjects.getHamburgerMenuElement();
        const isDisplayed = await hamburgerMenuElement.isDisplayed();
        assert.strictEqual(isDisplayed, true, 'Hamburger menu should be displayed.');
        await hamburgerMenuElement.click();

    }

    async closeTheNavDrawer() {
        const navDrawerCloseBtnElement = await commonObjects.getNavDrawerCloseBtnElement();
        const isDisplayed = await navDrawerCloseBtnElement.isDisplayed();
        assert.strictEqual(isDisplayed, true, 'Nav Drawer Close Btn element should be displayed.');
        await navDrawerCloseBtnElement.click();
    }

    async closeTheNavDrawerIfVisibleInUi() {
        const navDrawerCloseBtnElement = await commonObjects.getNavDrawerCloseBtnElement();
        const isDisplayed = await navDrawerCloseBtnElement.isDisplayed();
        if (isDisplayed) {
            await navDrawerCloseBtnElement.click();
        }
    }

    async closeFlashHourPopup() {
        const closeFlashHourButton = await commonObjects.getFlashHourPopupCloseIcon();
        // await el.click();


        // Ensure the element is displayed
        const isDisplayed = await closeFlashHourButton.isDisplayed();
        assert.strictEqual(isDisplayed, true, 'Close Flash Hour button should be displayed.');

        // Perform an action on the element (e.g., click)
        await closeFlashHourButton.click();



    }

    async scroll() {
        const { width, height } = await driver.getWindowRect(); // Get screen size

        const startX = width / 2; // Middle of the screen horizontally
        const startY = height * 0.8; // Start from 80% height (bottom)
        const endY = height * 0.4; // Move to 20% height (top)

        await driver.performActions([
            {
                type: "pointer",
                id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                    { type: "pointerMove", duration: 0, x: startX, y: startY }, // Touch start point
                    { type: "pointerDown", button: 0 }, // Press
                    { type: "pause", duration: 500 }, // Hold for smooth scrolling
                    { type: "pointerMove", duration: 1000, x: startX, y: endY }, // Move to the end position
                    { type: "pointerUp" } // Release
                ],
            },
        ]);


    }

    async isEndOfScroll() {
        let beforeScroll = await driver.getPageSource(); // Get UI structure before scroll
        await this.scroll(); // Perform a scroll
        let afterScroll = await driver.getPageSource(); // Get UI structure after scroll

        return beforeScroll === afterScroll; // If both are the same, no scrolling is possible
    }

    async scrollDownAndFindElement(element, MAX_SWIPES = 10, pauseDuration = 200, pointerMoveDuration = 600) {
        const maxSwipes = MAX_SWIPES || 10;

        for (let index = 1; index <= maxSwipes; index++) {
            // const isElementVisible = await $(element).isDisplayed();
            const isElementVisible = await element.isDisplayed();

            if (await isElementVisible) {
                return true;
            }

            const { x, y, width, height } = await driver.getWindowRect();

            const startX = x + width / 2; // Center horizontally
            const startY = y + height * 0.8; // Start near the bottom
            const endY = y + height * 0.3; // End near the top

            // Perform vertical swipe action
            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: pauseDuration },
                        { type: 'pointerMove', duration: pointerMoveDuration, x: startX, y: endY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }
        return false;
    }

    async scrollDownAndFindElement2(element, parentContainer, scrollHeight, maxScrolls) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 10;

        const location = await parentContainer.getLocation();
        const size = await parentContainer.getSize();
        const parentHeight = size.height;
        const parentWidth = size.width;
        const startX = Math.round(parentWidth * 0.5);
        const startY = Math.round(parentHeight * 0.2);
        const endY = Math.round(startY + scrollHeight);

        for (let i = 0; i < MAX_SCROLLS; i++) {
            if (await element.isDisplayed()) {
                return true;
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY + location.y },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY + location.y },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }


    async scrollUpAndFindElement2(element, MAX_SWIPES = 10) {
        const maxSwipes = MAX_SWIPES || 10;

        for (let index = 1; index <= maxSwipes; index++) {
            const isElementVisible = await element.isDisplayed();

            if (await isElementVisible) {
                return true;
            }

            const { x, y, width, height } = await driver.getWindowRect();

            const startX = x + width / 2; // Center horizontally
            const startY = y + height * 0.2; // Start near the top
            const endY = y + height * 0.8; // End near the bottom

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 300, x: startX, y: endY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }
        return false;
    }

    async backLoop(range) {
        try {
            for (let i = 0; i < range; i++) {
                await driver.pause(1000);
                await driver.back();
            }
        } catch (error) {
            globalState.isSuccessful = false;
            throw error;
        }
    }

    async confirmPayment() {
        try {
            await driver.pause(2000);

            const element = await commonObjects.confirmBtn;
            expect(await element.isDisplayed()).to.be.true;

            await commonObjects.confirmBtn.click();
            await driver.pause(4000);
        } catch (error) {
            globalState.isSuccessful = false;
            throw error;
        }
    }

    async verifyPaymentGateway() {
        await driver.pause(1000);
        await this.confirmPayment();
        await this.confirmPaymentPage();
        await this.backLoop(1);
    }

    async loadPaymentGateway() {
        try {
            if (isPackFound) {
                await driver.pause(1000);
                await this.confirmPayment();
                await this.confirmPaymentPage();
                await this.backLoop(1);
            }
            await this.backLoop(1);
        } catch (error) {
            globalState.isSuccessful = false;
            throw error;
        }
    }

    async scrollUpAndFindElementUsingObject(element, parentContainer, scrollHeight, maxScrolls) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 10;

        const location = await parentContainer.getLocation();
        const size = await parentContainer.getSize();
        const parentHeight = size.height;
        const parentWidth = size.width;
        const startX = Math.round(parentWidth * 0.5);
        const startY = Math.round(parentHeight * 0.8);
        const endY = Math.round(startY - scrollHeight);

        for (let i = 0; i < MAX_SCROLLS; i++) {
            if (await element.isDisplayed()) {
                return true;
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY + location.y }, // Include parent's position
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY + location.y }, // Include parent's position
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }
}

class CommonActionsAndroid extends CommonActions {

    async scrollToTop() {
        const maxSwipes = 50;
        const steps = 10; // less value = more scrolling speed

        await $(
            `android= new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(${maxSwipes},${steps})`
        );
    }

    async scrollToBottom() {
        const maxSwipes = 50;
        const steps = 10; // less value = more scrolling speed

        await $(`android= new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(${maxSwipes},${steps})`);
        await $(`android= new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(1,${steps})`);
    }

    async bareScrollToTop(options) {
        await this.scrollToTop();
    }

    async bareScrollToBottom(options) {
        await this.scrollToBottom();
    }

    async scrollToText(text) {
        return await $(`android= new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("${text}")`);
    }
    async clickBackIcon() {
        const btn = await commonObjects.upArrowIcon();
        const searchPageBackBtn = await commonObjects.backFromSearchPage();
        if (await btn.isDisplayed() == true) {
            await btn.click();
            return true;
        }
        else if (await searchPageBackBtn.isDisplayed() == true) {
            await searchPageBackBtn.click();
            return true;
        }
        else {
            return false;
        }
    }

    async scrollToElement(element, options) {
        const maxSwipes = options?.maxSwipes || 5
        const steps = options?.steps || 200; // less value = more scrolling speed

        for (let count = 0; count <= maxSwipes; count++) {
            if (await element.isDisplayed()) {
                return true;
            }
            await $(`android= new UiScrollable(new UiSelector().scrollable(true)).scrollForward(${steps})`);
        }
        return false;
    }

    async scrollUpAndFindText(text, parentContainer, scrollHeight, maxScrolls) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 20;

        const location = await parentContainer.getLocation();
        const size = await parentContainer.getSize();
        const parentHeight = size.height;
        const parentWidth = size.width;
        const startX = Math.round(parentWidth * 0.5);
        const startY = Math.round(parentHeight * 0.8);
        const endY = Math.round(startY - Math.min((parentHeight / 2), 500));

        for (let i = 0; i < MAX_SCROLLS; i++) {
            const textElement = await parentContainer.$(`android= new UiSelector().text("${text}")`);

            if (await textElement.isDisplayed()) {
                return true;
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY + location.y }, // Include parent's position
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY + location.y }, // Include parent's position
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }


    async goBack(times = 1) {
        for (let i = 0; i < times; i++) {
            await driver.back();
        }
    }

    // Returns xpath index of current UI
    async scrollVerticallyForClickOnApiElement(recyclerViewId, elementXpath, indexAPI = 1, maxScrolls = 20) {

        try {
            await driver.pause(1000); // Ensure the UI is ready before scrolling
            const recyclerView = await driver.$(
                `android=new UiSelector().resourceId("${recyclerViewId}")`
            );

            let elementVisible = false;
            let scrollCount = 0, index = 0, elementId, firstElement = '0000', found = false, indexUi, returnUiIndex;

            const recyclerViewSize = await recyclerView.getSize();
            const scrollByPixels = recyclerViewSize.height - (recyclerViewSize.height / 2);

            while (!elementVisible && scrollCount < maxScrolls) {

                indexUi = 0;

                for (let i = 1; i <= 100; i++) {
                    const element = $(`(${elementXpath})[${i}]`);
                    const isVisible = await element?.isDisplayed();

                    if (isVisible) {
                        indexUi++;
                        index++;
                        elementId = await element.elementId;
                        if (elementId == firstElement) {
                            index -= indexUi;
                        }
                        if (index === indexAPI) {
                            returnUiIndex = indexUi;
                            found = true;
                        }
                    } else {
                        break;
                    }
                }
                firstElement = elementId;

                if (found) {
                    break;
                }

                const recyclerViewLocation = await recyclerView.getLocation();
                const recyclerViewSize = await recyclerView.getSize();

                const startY = Math.round(recyclerViewLocation.y + (recyclerViewSize.height * 0.9));
                const endY = Math.max(startY - scrollByPixels, recyclerViewLocation.y);
                const centerX = Math.round(recyclerViewLocation.x + (recyclerViewSize.width / 2));

                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 600, x: centerX, y: endY },
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);

                await driver.pause(100);
                scrollCount++;
            }

            if (found) {
                return returnUiIndex;
            }

        } catch (error) {
            console.error(`Error during vertical scrolling: ${error.message}`);
            throw error;
        }
    }

    async scrollUpAndFindElement(xpathToFind, parentContainer, scrollHeight, maxScrolls) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 10;

        const location = await parentContainer.getLocation();
        const size = await parentContainer.getSize();
        const parentHeight = size.height;
        const parentWidth = size.width;
        const startX = Math.round(parentWidth * 0.5);
        const startY = Math.round(parentHeight * 0.8);
        const endY = Math.round(startY - scrollHeight);

        for (let i = 0; i < MAX_SCROLLS; i++) {
            const productCard = await parentContainer.$(xpathToFind);

            if (await productCard.isDisplayed()) {
                return true;
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY + location.y }, // Include parent's position
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY + location.y }, // Include parent's position
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }

    async clickOnBottomNavHomeButton() {
        const bottomTabHomeBtn = await commonObjects.getBottomTabHomeBtn();
        let isSelected = await bottomTabHomeBtn.isSelected();
        if (!isSelected) {
            await bottomTabHomeBtn.click();
            isSelected = await bottomTabHomeBtn.isSelected();
        }
        expect(isSelected).to.be.true;
    }

    async scrollUpToText(text, maxScrolls = 10) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 10;
        const { height, width } = await driver.getWindowRect();

        const startX = Math.round(width * 0.5);
        const startY = Math.round(height * 0.8);
        const endY = Math.round(height * 0.2);

        for (let i = 0; i < MAX_SCROLLS; i++) {
            try {
                const textElement = await $(`android=new UiSelector().text("${text}")`);
                if (await textElement.isDisplayed()) {
                    return true;
                }
            } catch (error) {
                // Element not found, continue scrolling
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }

    async scrollDownToText(text, maxScrolls = 10) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 10;
        const { height, width } = await driver.getWindowRect();

        const startX = Math.round(width * 0.5);
        const startY = Math.round(height * 0.2);
        const endY = Math.round(height * 0.8);

        for (let i = 0; i < MAX_SCROLLS; i++) {
            try {
                const textElement = await $(`android=new UiSelector().text("${text}")`);
                if (await textElement.isDisplayed()) {
                    return true;
                }
            } catch (error) {
                // Element not found, continue scrolling
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }

    async confirmPaymentPage() {
        try {
            if (isPackFound) {
                const isConfirmPage1 = await commonObjects.makePaymentConfirmation1?.isDisplayed();
                const isConfirmPage2 = await commonObjects.makePaymentConfirmation2?.isDisplayed();
                const isAnyConfirmPageDisplayed = isConfirmPage1 || isConfirmPage2;

                expect(isAnyConfirmPageDisplayed).to.equal(true);

                if (isConfirmPage2) {
                    await driver.pause(2000);
                    await driver.back();
                    await driver.pause(500);
                    await driver.back();
                }
            }
        } catch (error) {
            globalState.isSuccessful = false;
            throw error;
        }
    }

    async isHomePageDisplayed() {
        const offerModal = await commonObjects.getOfferModal();
        if (offerModal && await offerModal.isDisplayed()) {
            await offerModal.click();
        }
        const isSearchElement = await commonObjects.getSearchElement();
        const isNotificationElement = await commonObjects.getNotificationsElement();
        const isHamburgerMenuElement = await commonObjects.getHamburgerMenuElement();

        const isSearchElementDisplayed = await isSearchElement.isDisplayed();
        const isNotificationElementDisplayed = await isNotificationElement.isDisplayed();
        const isHamburgerMenuElementDisplayed = await isHamburgerMenuElement.isDisplayed();

        if (isSearchElementDisplayed && isNotificationElementDisplayed && isHamburgerMenuElementDisplayed) {
            return true;
        }
        else {
            return false;
        }
    }

    async logoutUserAndroid() {

    }

    async isBackIconVisible() {
        const backIcon = await commonObjects.upArrowIcon();
        return await backIcon.isDisplayed();
    }
}

class CommonActionsIos extends CommonActions {

    async confirmPaymentPage() {
        try {
            if (isPackFound) {
                const isConfirmPage1 = await commonObjects.makePaymentConfirmation1?.isDisplayed();
                const isConfirmPage2 = await commonObjects.makePaymentConfirmation2?.isDisplayed();
                const isAnyConfirmPageDisplayed = isConfirmPage1 || isConfirmPage2;

                expect(isAnyConfirmPageDisplayed).to.equal(true);

                if (isConfirmPage1) {
                    const crossBtn = await commonObjects.crossBtn;
                    await crossBtn.waitForDisplayed({ timeout: 10000 });
                    expect(await crossBtn.isDisplayed()).to.be.true;
                    await crossBtn.click();
                }

                if (isConfirmPage2) {
                    const crossBtn = await commonObjects.backFromPayment;
                    await crossBtn.waitForDisplayed({ timeout: 10000 });
                    expect(await crossBtn.isDisplayed()).to.be.true;
                    await crossBtn.click();

                    const ok = await commonObjects.ok;
                    await driver.pause(2000);
                    if (await ok.isDisplayed()) {
                        await ok.click();
                    }
                }

            }
        } catch (error) {
            globalState.isSuccessful = false;
            throw error;
        }
    }

    async scrollToText(text) {
        while (true) {
            try {
                const element = await $(`//XCUIElementTypeStaticText[@name="${text}"]`);
                if (await element.isDisplayed()) {
                    return element; // Element found, stop scrolling
                }
            } catch (e) {
                // Scroll up if the element is not found
                await driver.execute('mobile: swipe', { direction: 'up' });
            }
        }
    }

    async clickBackIcon() {
        try {
            const navigateBackFromBkashAddPage = await commonObjects.navigateBackFromBkashAddPage();
            const navigateBackFromBkashPage = await commonObjects.navigateBackFromBkashPage();
            const navigateBackFromamarOffer = await commonObjects.navigateBackFromamarOffer();
            const rechargePageBackBtn = await commonObjects.rechargePageBackBtn();
            const alertCloseBtn = await commonObjects.closeAlert();
            const menuCloseBtn = await commonObjects.menuClose();
            const upArrowIcon = await commonObjects.upArrowIcon(); // `~Navigate up` for iOS
            const backFromSearchPage = await commonObjects.backFromSearchPage();
            // Check visibility only once and store results
            const isBkashPageVisible = await navigateBackFromBkashPage?.isDisplayed() || false;
            const isBkashAddPageVisible = await navigateBackFromBkashAddPage?.isDisplayed() || false;
            const isAmarOfferVisible = await navigateBackFromamarOffer?.isDisplayed() || false;
            const isRechargePageVisible = await rechargePageBackBtn?.isDisplayed() || false;
            const isAlertVisible = await alertCloseBtn?.isDisplayed() || false;
            const isMenuCloseVisible = await menuCloseBtn?.isDisplayed() || false;
            const isUpArrowIconVisible = await upArrowIcon?.isDisplayed() || false;
            const isBackFromSearchPageVisible = await backFromSearchPage?.isDisplayed() || false;
            if (isBkashPageVisible) {
                await navigateBackFromBkashPage.click();
                return true;
            } else if (isBkashAddPageVisible) {
                await navigateBackFromBkashAddPage.click();
                return true;
            } else if (isAmarOfferVisible) {
                await navigateBackFromamarOffer.click();
                return true;
            } else if (isRechargePageVisible) {
                await rechargePageBackBtn.click();
                return true;
            }
            else if (isAlertVisible) {
                await alertCloseBtn.click();
                return true;
            }
            else if (isMenuCloseVisible) {
                await menuCloseBtn.click();
                return true;
            }
            else if (isUpArrowIconVisible) {
                await upArrowIcon.click();
                return true;
            }
            else if (isBackFromSearchPageVisible) {
                await backFromSearchPage.click();
                return true;
            }
            await driver.pause(1000)
        } catch (error) {
            console.error("Error clicking back icon:", error);
            return false;
        }
    }

    async isHomePageDisplayed() {
        const offerModal = await commonObjects.getOfferModal();
        if (offerModal && await offerModal.isDisplayed()) {
            await offerModal.click();
        }
        const isSearchElement = await commonObjects.getSearchElement();
        const isNotificationElement = await commonObjects.getNotificationsElement();
        const isSearchElementDisplayed = await isSearchElement.isDisplayed();
        const isNotificationElementDisplayed = await isNotificationElement.isDisplayed();
        if (isSearchElementDisplayed && isNotificationElementDisplayed) {
            return true;
        }
        else {
            return false;
        }
    }

    async scrollUpAndFindText(text, parentContainer, scrollHeight, maxScrolls) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 20;

        const location = await parentContainer.getLocation();
        const size = await parentContainer.getSize();
        const parentHeight = size.height;
        const parentWidth = size.width;
        const startX = Math.round(parentWidth * 0.5);
        const startY = Math.round(parentHeight * 0.8);
        const endY = Math.round(startY - Math.min((parentHeight / 2), 500));

        for (let i = 0; i < MAX_SCROLLS; i++) {
            const textElement = $(`-ios predicate string:name == "${text}"`);


            if (await textElement.isDisplayed()) {
                return true;
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY + location.y }, // Include parent's position
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY + location.y }, // Include parent's position
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }
    async goBack(times = 1) {
        this.clickBackIcon();
    }

    // scroll till the element is visible
    async scrollVerticallyForClickOnApiElement(recyclerViewId, elementXpath, indexAPI = 1, maxScrolls = 20, childIndex) {

        try {
            const recyclerView = await driver.$(recyclerViewId);

            let elementVisible = false;
            let scrollCount = 0;

            const recyclerViewSize = await recyclerView.getSize();
            const scrollByPixels = recyclerViewSize.height - (recyclerViewSize.height / 2);


            while (!elementVisible && scrollCount < maxScrolls) {
                const element = $(`(${elementXpath})[${indexAPI}]/*[${childIndex}]`);
                let isVisible = await element.getAttribute("visible");

                if (isVisible === "true") {
                    elementVisible = true;
                    break;
                }

                const recyclerViewLocation = await recyclerView.getLocation();
                const recyclerViewSize = await recyclerView.getSize();

                const startY = Math.round(recyclerViewLocation.y + (recyclerViewSize.height * 0.9));
                const endY = Math.max(startY - scrollByPixels, recyclerViewLocation.y);
                const centerX = Math.round(recyclerViewLocation.x + (recyclerViewSize.width / 2));

                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 600, x: centerX, y: endY },
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);

                await driver.pause(100);
                scrollCount++;
            }

        } catch (error) {
            console.error(`Error during vertical scrolling: ${error.message}`);
            throw error;
        }
    }


    async scrollToTop(recyclerViewId, elementXpath, indexAPI = 1, childIndex = 3, maxScrolls = 20) {

        try {
            const recyclerView = await driver.$(recyclerViewId);

            let elementVisible = false;
            let scrollCount = 0;

            const recyclerViewSize = await recyclerView.getSize();
            const scrollByPixels = recyclerViewSize.height + 10000;


            while (!elementVisible && scrollCount < maxScrolls) {
                const element = $(`${elementXpath}[${indexAPI}]/*[${childIndex}]`);
                let isVisible = await element.getAttribute("visible");

                if (isVisible === "true") {
                    elementVisible = true;
                    break;
                }

                const recyclerViewLocation = await recyclerView.getLocation();
                const recyclerViewSize = await recyclerView.getSize();

                const startY = Math.round(recyclerViewLocation.y + (recyclerViewSize.height * 0.9));
                const endY = Math.max(startY - scrollByPixels, recyclerViewLocation.y);
                const centerX = Math.round(recyclerViewLocation.x + (recyclerViewSize.width / 2));

                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: centerX, y: endY },    // Start from lower position
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 600, x: centerX, y: startY }, // Move to higher position
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);
                scrollCount++;
            }

        } catch (error) {
            console.error(`Error during vertical scrolling: ${error.message}`);
            throw error;
        }
    }

    async scrollToBottom(elementPath, index, childIndex) {
        for (let i = 0; i < 20; i++) {
            let element = $(`(${elementPath})[${index}]/*[${childIndex}]`);
            let isVisible = await element?.isDisplayed();

            if (isVisible) {
                break;
            }
            await driver.execute('mobile: scroll', { direction: 'down' });
        }
    }

    async bareScrollToTop(options) {
        const maxSwipes = options?.maxSwipes || 10
        for (let count = 0; count <= maxSwipes; count++) {
            await driver.executeScript("mobile: scroll", [{ direction: 'up' }]);
        }
    }

    async bareScrollToBottom(options) {
        const maxSwipes = options?.maxSwipes || 10
        for (let count = 0; count <= maxSwipes; count++) {
            await driver.executeScript("mobile: scroll", [{ direction: 'down' }]);
        }
    }

    async scrollToElement(element, options) {
        const maxSwipes = options?.maxSwipes || 5;
        const steps = options?.steps || 200; // less value = more scrolling speed

        for (let count = 0; count <= maxSwipes; count++) {
            if (await element.isDisplayed()) {
                return true;
            }
            await driver.execute('mobile: scroll', { direction: 'down' });// scroll to down to find the element
            // Commenting the scrolling code using swipe, as didn't work always and replacing it with scroll
            // Swipe up using mobile: swipe command
            /*await driver.execute('mobile: swipe', {
                direction: 'up',
                element: element, // directly use the element here
                velocity: steps // Adjust the swipe speed
            });*/
        }
        return false;
    }

    async scrollUpAndFindElement(xpathToFind, parentContainer, scrollHeight, maxScrolls) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 10;

        const location = await parentContainer.getLocation();
        const size = await parentContainer.getSize();
        const parentHeight = size.height;
        const parentWidth = size.width;
        const startX = Math.round(parentWidth * 0.5);
        const startY = Math.round(parentHeight * 0.8);
        const endY = Math.round(startY - scrollHeight);

        for (let i = 0; i < MAX_SCROLLS; i++) {
            const productCard = await parentContainer.$(xpathToFind);

            if (await productCard.isDisplayed()) {
                return true;
            }

            // Use mobile swipe action instead of performActions
            await driver.execute('mobile: swipe', {
                direction: 'up',
                startX: startX,
                startY: startY + location.y,  // Add parent's Y position
                endX: startX,
                endY: endY + location.y,  // Add parent's Y position
                duration: 600
            });
        }

        return false;
    }

    async clickOnBottomNavHomeButton() {
        const bottomTabHomeBtn = await commonObjects.getBottomTabHomeBtn();
        const bottomTabSelectedHomeBtn = await commonObjects.getBottomTabSelectedHomeBtn();
        let isBottomTabSelectedHomeBtnDisplayed = await bottomTabSelectedHomeBtn.isDisplayed();
        if (!isBottomTabSelectedHomeBtnDisplayed) {
            expect(await bottomTabHomeBtn.isDisplayed()).to.be.true;
            await bottomTabHomeBtn.click();
            await driver.pause(200);
            expect(await bottomTabSelectedHomeBtn.isDisplayed()).to.be.true;
        }
    }

    async scrollUpToText(text, maxScrolls = 10) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 10;
        const { height, width } = await driver.getWindowRect();

        const startX = Math.round(width * 0.5);
        const startY = Math.round(height * 0.75);
        const endY = Math.round(height * 0.3);

        for (let i = 0; i < MAX_SCROLLS; i++) {
            try {
                const textElement = await $(`-ios predicate string:type == 'XCUIElementTypeStaticText' AND name == '${text}'`);
                if (await textElement.isDisplayed()) {
                    return true;
                }
            } catch (error) {
                // Element not found, continue scrolling
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }

    async scrollDownToText(text, maxScrolls = 10) {
        const MAX_SCROLLS = maxScrolls ? maxScrolls : 10;
        const { height, width } = await driver.getWindowRect();

        const startX = Math.round(width * 0.5);
        const startY = Math.round(height * 0.3);
        const endY = Math.round(height * 0.75);

        for (let i = 0; i < MAX_SCROLLS; i++) {
            try {
                const textElement = await $(`-ios predicate string:type == 'XCUIElementTypeStaticText' AND name == '${text}'`);
                if (await textElement.isDisplayed()) {
                    return true;
                }
            } catch (error) {
                // Element not found, continue scrolling
            }

            await driver.performActions([
                {
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: startX, y: startY },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 100 },
                        { type: 'pointerMove', duration: 600, x: startX, y: endY },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]);
        }

        return false;
    }

    async scrollToElement2(driver, element, endY) {
        try {
            while (true) {
                if (await element.isDisplayed()) {
                    return true;
                }
                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: 250, y: 700 },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pause', duration: 100 },
                            { type: 'pointerMove', duration: 500, x: 250, y: endY },
                            { type: 'pointerUp' }
                        ]
                    }
                ]);
            }
        } catch (error) {
            globalState.isSuccessful = false;
            throw error;
        }
    }

    async isBackIconVisible() {
        const navigateBackFromBkashAddPage = await commonObjects.navigateBackFromBkashAddPage();
        const navigateBackFromBkashPage = await commonObjects.navigateBackFromBkashPage();
        const navigateBackFromamarOffer = await commonObjects.navigateBackFromamarOffer();
        const rechargePageBackBtn = await commonObjects.rechargePageBackBtn();
        const alertCloseBtn = await commonObjects.closeAlert();
        const backFromSearchPage = await commonObjects.backFromSearchPage();

        const isBkashPageVisible = await navigateBackFromBkashPage?.isDisplayed() || false;
        const isBkashAddPageVisible = await navigateBackFromBkashAddPage?.isDisplayed() || false;
        const isAmarOfferVisible = await navigateBackFromamarOffer?.isDisplayed() || false;
        const isRechargePageVisible = await rechargePageBackBtn?.isDisplayed() || false;
        const isAlertVisible = await alertCloseBtn?.isDisplayed() || false;
        const isBackFromSearchPageVisible = await backFromSearchPage?.isDisplayed() || false;

        if (isBkashPageVisible) {
            return await navigateBackFromBkashPage.isDisplayed();
        } else if (isBkashAddPageVisible) {
            return await navigateBackFromBkashAddPage.isDisplayed();
        } else if (isAmarOfferVisible) {
            return await navigateBackFromamarOffer.isDisplayed();
        } else if (isRechargePageVisible) {
            return await rechargePageBackBtn.isDisplayed();
        }
        else if (isAlertVisible) {
            return await alertCloseBtn.isDisplayed();
        }
        else if (isBackFromSearchPageVisible) {
            return await backFromSearchPage.isDisplayed();
        }

        return false;
    }
}

module.exports =
    config.getCurrentPlatform() === "Android"
        ? new CommonActionsAndroid()
        : new CommonActionsIos();
