const config = require("../../config/config");
const recipeListObjects = require("./recipe_list_objects");
const recipeAPI = require('../../api/recipe_list.api');
// const commonActions = require("../common/commonActions.js");

const {expect, assert} = require("chai");
const report =require('@wdio/allure-reporter');
const globalState = require('../globalState.js');
let recipeListData;


class RecipeListActions {
  recipeListPageTitle = "RecipeHub";
  isRecipeListPage = false;

  async getDataFromAPI () {
    recipeListData = await recipeAPI.getRecipeListApiResponse();
  }

  async verifyTitleOfRecipeListPage() {
    try {
      let recipeListPageTitleElement = await recipeListObjects.getPageTitle();
      this.isRecipeListPage = await recipeListPageTitleElement.isDisplayed();
      expect(this.isRecipeListPage).to.equal(true);
    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to verify the Recipe List Page Title: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }


  isRecipeListPagePresent() {
    return this.isRecipeListPage;
  }

}


class RecipeListActionsAndroid extends RecipeListActions {

}

class RecipeListActionsIos extends RecipeListActions {

}



module.exports =
    config.getCurrentPlatform() === "Android"
        ? new RecipeListActionsAndroid()
        : new RecipeListActionsIos();


