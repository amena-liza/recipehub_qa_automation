const recipeListPageActions = require('./recipe_list_actions');
const globalState = require("../globalState");
let isRecipeListPage = true;

describe("Recipe List Page Test Case Automation", () => {

    before(async () => {
        globalState.isSuccessful = true;
    })

    beforeEach('skip rest of tests cases if a tests case fails', async function () {
        if (globalState.isSuccessful) {
            if (!isRecipeListPage) {
                this.skip();
            }
        } else {
            this.skip();
        }
    });

    it('Get Data from API', async () => {
        await recipeListPageActions.getDataFromAPI();
    });

    it('#TC001 Verify that Title is Showing Correctly on the Recipe List Page.', async () => {
        await recipeListPageActions.verifyTitleOfRecipeListPage();
        isRecipeListPage = recipeListPageActions.isRecipeListPagePresent();
    });

    it('#TC002 Verify that Recipe List Loads Correctly on the Recipe List Page.', async () => {
        await recipeListPageActions.verifyRecipeListLoadsCorrectly();
    });

    it('#TC003 Verify user can toggle recipes as favorite from the Recipe List Page.', async () => {
        await recipeListPageActions.verifyRecipeCardToggle();
    });

    it('#TC004 Verify Clicking On Recipe Card Navigates To Recipe Details Page.', async () => {
        await recipeListPageActions.verifyClickingOnRecipeCardNavigatesToRecipeDetailsPage();
    });

    it('#TC005 Verify Recipe Details Page Title.', async () => {
        await recipeListPageActions.verifyRecipeDetailsPageTitle();
    });

    it('#TC006 Verify Recipe Details Page Title.', async () => {
        await recipeListPageActions.verifyRecipeDetailsPageTitle();
    });

    it('#TC007 Verify User Can Goes Back From Recipe Details Page.', async () => {
        await recipeListPageActions.verifyUserCanGoesBackFromRecipeDetailsPage();
    });

    it('#TC008 Verify User Can Filter Recipes By Difficulty Filter.', async () => {
        await recipeListPageActions.verifyUserCanFilterRecipesByDifficultyFilter();
    });

    it('#TC009 Verify User Can Click Hamburger Button.', async () => {
        await recipeListPageActions.verifyUserCanClickHamburgerButton();
    });

    it('#TC010 Verify User Can Close Hamburger Button.', async () => {
        await recipeListPageActions.verifyUserCanCloseHamburgerButton();
    });

    it('#TC011 Verify User Can Click Favorites Page From Hamburger Menu.', async () => {
        await recipeListPageActions.verifyUserCanClickFavoritesPageFromHamburgerMenu();
    });

    it('#TC012 Verify Favorite Toggle On Favorite Page.', async () => {
        await recipeListPageActions.verifyFavoriteToggleOnFavoritePage();
    });

    it('#TC013 Verify User Can Goes Back To Recipe List Page.', async () => {
        await recipeListPageActions.verifyUserCanGoesBackToRecipeListPage();
    });

    // after(async () => {
    //     require('../logout/logout.spec');
    // });

});