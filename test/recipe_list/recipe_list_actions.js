const config = require("../../config/config");
const recipeListObjects = require("./recipe_list_objects");
const recipeAPI = require('../../api/recipe_list.api');
// const commonActions = require("../common/commonActions.js");
const commonObjects = require("../common/commonObject.js");

const {expect, assert} = require("chai");
const report =require('@wdio/allure-reporter');
const globalState = require('../globalState.js');
let recipeListData;


class RecipeListActions {
  recipeListPageTitle = "RecipeHub";
  isRecipeListPage = false;
  firstRecipeID ;

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

  async verifyRecipeListLoadsCorrectly() {
    try {

      const firstRecipeCardAid = "recipe_id_" + recipeListData[0].id;
      let firstRecipeCardElement = await commonObjects.getTextViewByAccessibilityId(firstRecipeCardAid);
      expect(await firstRecipeCardElement.isDisplayed()).to.equal(true);

      // let firstRecipe = recipeListData[0];
      // this.firstRecipeID = firstRecipe.id;
      // let aidText = firstRecipe.name + "\n" + firstRecipe.cookTimeMinutes + "\n" + firstRecipe.difficulty;
      // let recipeListCardElement = await commonObjects.getTextViewByAccessibilityId(aidText);
      // expect(await recipeListCardElement.isDisplayed()).to.equal(true);
    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to verify if the Recipe List Loads Correctly: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }

  async verifyRecipeCardToggle() {
    try {

      const firstFavoriteBtnAid = "favorite_" + recipeListData[0].id;
      const firstNotFavoriteBtnAid = "not_favorite_" + recipeListData[0].id;

      let firstNotFavoriteBtnElement = await commonObjects.getTextViewByAccessibilityId(firstNotFavoriteBtnAid);
      expect(await firstNotFavoriteBtnElement.isDisplayed()).to.equal(true);
      await firstNotFavoriteBtnElement.click();
      await driver.pause(500);

      let firstFavoriteBtnElement = await commonObjects.getTextViewByAccessibilityId(firstFavoriteBtnAid);
      expect(await firstFavoriteBtnElement.isDisplayed()).to.equal(true);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to verify the Recipe List Page Title: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }

  async verifyClickingOnRecipeCardNavigatesToRecipeDetailsPage() {
    try {

      const firstRecipeCardAid = "recipe_id_" + recipeListData[0].id;
      let firstRecipeCardElement = await commonObjects.getTextViewByAccessibilityId(firstRecipeCardAid);
      expect(await firstRecipeCardElement.isDisplayed()).to.equal(true);
      await firstRecipeCardElement.click();
      await driver.pause(500);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to Verify Clicking On Recipe Card Navigates To Recipe Details Page: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }

  async verifyRecipeDetailsPageTitle() {
    try {

      const recipeDetailCardAid = "" + recipeListData[0].name;
      let recipeDetailCardElement = await commonObjects.getTextViewByAccessibilityId(recipeDetailCardAid);
      expect(await recipeDetailCardElement.isDisplayed()).to.equal(true);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to verify the Recipe List Page Title: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }


  async verifyUserCanGoesBackFromRecipeDetailsPage() {
    try {

      const getRecipeDetailsPageBackButtonElement  = await recipeListObjects.getRecipeDetailsPageBackButton();
      expect(await getRecipeDetailsPageBackButtonElement.isDisplayed()).to.equal(true);
      await getRecipeDetailsPageBackButtonElement.click();
      await driver.pause(2000);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to Verify User Can Goes Back From Recipe Details Page: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }


  async verifyUserCanFilterRecipesByDifficultyFilter() {
    try {

      const difficultyFilterElement = await commonObjects.getTextViewByAccessibilityId('All');
      expect(await difficultyFilterElement.isDisplayed()).to.equal(true);
      await difficultyFilterElement.click();
      await driver.pause(500);

      const easyDifficultyFilterElement = await commonObjects.getTextViewByAccessibilityId('Easy');
      expect(await easyDifficultyFilterElement.isDisplayed()).to.equal(true);
      await easyDifficultyFilterElement.click();
      await driver.pause(500);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to Verify User Can Filter Recipes By Difficulty Filter: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }

  async verifyUserCanClickHamburgerButton() {
    try {

      const hamburgerMenuAid = "Open navigation menu";
      let hamburgerMenuElement = await commonObjects.getTextViewByAccessibilityId(hamburgerMenuAid);
      expect(await hamburgerMenuElement.isDisplayed()).to.equal(true);
      await hamburgerMenuElement.click();
      await driver.pause(500);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Verify User Can Click Hamburger Button: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }

  async verifyUserCanCloseHamburgerButton() {
    try {
      let hamburgerMenuCloseElement = await commonObjects.getTextViewByAccessibilityId('Close');
      expect(await hamburgerMenuCloseElement.isDisplayed()).to.equal(true);
      await hamburgerMenuCloseElement.click();
      await driver.pause(500);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to Verify User Can Close Hamburger Button: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }

  async verifyUserCanClickFavoritesPageFromHamburgerMenu() {
    try {
      const hamburgerMenuAid = "Open navigation menu";
      let hamburgerMenuElement = await commonObjects.getTextViewByAccessibilityId(hamburgerMenuAid);
      await hamburgerMenuElement.click();
      await driver.pause(500);

      let favoriteLinkElement = await commonObjects.getTextViewByAccessibilityId('Favorites');
      expect(await favoriteLinkElement.isDisplayed()).to.equal(true);
      await favoriteLinkElement.click();
      await driver.pause(2000);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to Verify User Can Click Favorites Page From Hamburger Menu: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }

  async verifyFavoriteToggleOnFavoritePage() {
    try {

      const firstFavoriteBtnAid = "favorite_" + recipeListData[0].id;
      const firstNotFavoriteBtnAid = "not_favorite_" + recipeListData[0].id;

      let firstNotFavoriteBtnElement = await commonObjects.getTextViewByAccessibilityId(firstFavoriteBtnAid);
      expect(await firstNotFavoriteBtnElement.isDisplayed()).to.equal(true);
      await firstNotFavoriteBtnElement.click();
      await driver.pause(500);

      // let firstFavoriteBtnElement = await commonObjects.getTextViewByAccessibilityId(firstNotFavoriteBtnAid);
      // expect(await firstFavoriteBtnElement.isDisplayed()).to.equal(true);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to Verify Favorite Toggle On Favorite Page: ${error.message}`,
          () => {}
      );
      throw error;
    }
  }

  async verifyUserCanGoesBackToRecipeListPage() {
    try {

      let recipeDetailsPageBackButton = await recipeListObjects.getRecipeFavoritePageBackButton();
      expect(await recipeDetailsPageBackButton.isDisplayed()).to.equal(true);
      await recipeDetailsPageBackButton.click();
      await driver.pause(500);

    } catch (error) {
      globalState.isSuccessful = false;
      await report.step(
          `Failed to Verify User Can Goes Back To Recipe List Page: ${error.message}`,
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


