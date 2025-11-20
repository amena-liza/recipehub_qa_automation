const config = require("../../config/config");

class Objects { }

class ObjectsAndroid extends Objects {
  async getPageTitle() {
    return driver.$('~RecipeHub');
  }


}
 
module.exports =
  config.getCurrentPlatform() === "Android"
    ? new ObjectsAndroid()
    : new ObjectsIos();