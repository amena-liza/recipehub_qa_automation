const axios = require('axios');
const { BASE_URL, AMAR_OFFER_HASH, TIMESTAMP, CONNECTION_TYPE, MOBILE_NO } = process.env;
const { recipeList } = require('../constants/apiEndpoints');

class FavoritesApi {
    async getAmarOfferApiResponse() {
        try {
            const apiURL = `${BASE_URL}${recipeList}`;

            const response = await axios.get(apiURL, {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    limit: 100
                }
            });

            return response;
        } catch (error) {
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Status Code:', error.response.status);
                console.error('Error Headers:', error.response.headers);
            } else if (error.request) {
                console.error('No Response:', error.request);
            } else {
                console.error('Axios Error:', error.message);
            }

            throw error;
        }
    }
}


module.exports = new FavoritesApi();
