const config = require("../../config/config");

class Objects { }

class ObjectsAndroid extends Objects {
  async getPageTitle() {
    return driver.$('~RecipeHub');
  }

  async getRecipeDetailsPageBackButton() {
    return driver.$('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[1]');
  }


  async getRecipeFavoritePageBackButton() {
    return driver.$('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button');
  }




}
 
module.exports =
  config.getCurrentPlatform() === "Android"
    ? new ObjectsAndroid()
    : new ObjectsIos();