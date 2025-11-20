const { VERSION_CODE, VERSION_CODE_IOS } = process.env;

function getCurrentPlatform(){
  return driver.requestedCapabilities['platformName']
}

function getPlatformVersion(){
  const currentPlatform = driver.requestedCapabilities['platformName'];
  return currentPlatform === "Android" ? VERSION_CODE : VERSION_CODE_IOS;
}

module.exports={
  getCurrentPlatform, getPlatformVersion
}

