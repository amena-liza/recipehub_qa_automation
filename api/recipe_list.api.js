import {finalizeSchema} from "appium";

const axios = require('axios');
const baseUrl = process.env.BASE_URL;
import {recipeList} from '../constants/apiEndpoints';



class RecipeListApi {
    _pageSize = 30;

    async getRecipeListApiResponse(refresh=false, currentRecipes=[], query="", difficulty="") {
        const apiURL = baseUrl + recipeList;
        let response = await axios.get(apiURL,{
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                skip: refresh ? 0 : currentRecipes.length,
                limit: this._pageSize,
                query: query,
                difficulty: difficulty,
            }
        });

        console.log(response.data);
        // Apply filter for difficulties;
        return response?.data?.recipes;

    }
}

module.exports = new RecipeListApi();
