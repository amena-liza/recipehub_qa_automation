// env.js
const dotenvFlow = require('dotenv-flow');

dotenvFlow.config({
    node_env: process.env.NODE_ENV, // picks environment-specific .env.*
    default_node_env: 'development', // default to 'development'
    path: './', // path to .env* files directory
    purge_dotenv: true, // ensures environment-specific .env.* overrides .env
});

module.exports = process.env;
