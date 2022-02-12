// KEYS.JS
const envStage = process.env.REACT_APP_STAGE;
const currentStage = envStage ? envStage.trim() : "local";

if (currentStage === 'production') {
    // PRODUCTIONS KEYS
    module.exports = require('./production');
} else if (currentStage === 'development') {
    // DEV KEYS
    module.exports = require('./development');
} else if (currentStage === 'local') {
    // DEV KEYS
    module.exports = require('./local');
}