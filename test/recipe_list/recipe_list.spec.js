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

    // after(async () => {
    //     require('../logout/logout.spec');
    // });

});