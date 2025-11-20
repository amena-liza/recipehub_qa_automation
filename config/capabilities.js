const path = require('path');

const localCapabilities = {
  'device1': {
    platformName: process.env.PLATFORM_NAME_ANDROID,
    'appium:deviceName': process.env.DEVICE_NAME,
    'appium:automationName': process.env.AUTOMATION_NAME,
    'appium:app': path.join(process.cwd(), './app/android/' + process.env.APP_APK_NAME),
    'appium:platformVersion': process.env.PLATFORM_VERSION,
    'appium:autoGrantPermissions': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoAcceptAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoDismissAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:noReset': process.env.NO_RESET,
    'appium:fullReset': process.env.FULL_RESET
  },
  // 'device2': {
  //   platformName: process.env.PLATFORM_NAME_IOS,
  //   'appium:platformVersion': process.env.PLATFORM_VERSION_IOS,
  //   'appium:deviceName': process.env.DEVICE_NAME_IOS,
  //   'appium:automationName': process.env.AUTOMATION_NAME_IOS,
  //   'appium:bundleId': process.env.BUNDLE_ID_IOS,
  //   'appium:udid': process.env.DEVICE_UDID_IOS,
  //   'appium:xcodeOrgId': process.env.XCODE_ORG_ID,
  //   'appium:xcodeSigningId': process.env.XCODE_SIGNING_ID,
  //   'appium:updatedWDABundleId': process.env.XCODE_UPDATED_WDA_BUNDLE_ID,
  //   'appium:useNewWDA': process.env.USE_NEW_WDA,
  //   'appium:autoGrantPermissions': process.env.AUTO_GRANT_PERMISSION,
  //   'appium:autoAcceptAlerts': process.env.AUTO_GRANT_PERMISSION,
  //   'appium:autoDismissAlerts': process.env.AUTO_GRANT_PERMISSION,
  //   'appium:noReset': process.env.NO_RESET
  // }
};

const browserStackCapabilities = {
  'device1': {
    platformName: process.env.PLATFORM_NAME_ANDROID,
    'appium:automationName': process.env.AUTOMATION_NAME,
    'appium:autoGrantPermissions': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoAcceptAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoDismissAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:noReset': process.env.NO_RESET,
    'appium:fullReset': process.env.FULL_RESET,
    "appium:app" : process.env.BROWSERSTACK_APP_PATH_ANDROID,
    'bstack:options': {
      deviceName: 'Samsung Galaxy S22 Ultra',
      platformVersion: '12.0'
    }
  },
  'device2': {
    platformName: process.env.PLATFORM_NAME_ANDROID,
    'appium:automationName': process.env.AUTOMATION_NAME,
    'appium:autoGrantPermissions': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoAcceptAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoDismissAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:noReset': process.env.NO_RESET,
    'appium:fullReset': process.env.FULL_RESET,
    "appium:app" : process.env.BROWSERSTACK_APP_PATH_ANDROID,
    'bstack:options': {
      deviceName: 'Google Pixel 7 Pro',
      platformVersion: '13.0'
    }
  },
  'device3': {
    platformName: process.env.PLATFORM_NAME_ANDROID,
    'appium:automationName': process.env.AUTOMATION_NAME,
    'appium:autoGrantPermissions': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoAcceptAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoDismissAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:noReset': process.env.NO_RESET,
    'appium:fullReset': process.env.FULL_RESET,
    "appium:app" : process.env.BROWSERSTACK_APP_PATH_ANDROID,
    'bstack:options': {
      deviceName: 'OnePlus 9',
      platformVersion: '11.0'
    }
  },
  'device4': {
    'platformName' : process.env.PLATFORM_NAME_IOS,
    'appium:automationName': process.env.AUTOMATION_NAME_IOS,
    'appium:autoGrantPermissions': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoAcceptAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoDismissAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:noReset': process.env.NO_RESET,
    'appium:fullReset': process.env.FULL_RESET,
    "appium:app" : process.env.BROWSERSTACK_APP_PATH_IOS,
    'bstack:options': {
      deviceName: "iPhone 14",
      osVersion: "16"
    }
  },
  'device5': {
    'platformName' : process.env.PLATFORM_NAME_IOS,
    'appium:automationName': process.env.AUTOMATION_NAME_IOS,
    'appium:autoGrantPermissions': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoAcceptAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:autoDismissAlerts': process.env.AUTO_GRANT_PERMISSION,
    'appium:noReset': process.env.NO_RESET,
    'appium:fullReset': process.env.FULL_RESET,
    'bstack:options' : {
        deviceName: "iPhone 13 Pro Max",
        osVersion: "15"
    }
  }
};

module.exports = {
  localCapabilities,
  browserStackCapabilities
};