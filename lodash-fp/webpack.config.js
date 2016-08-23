const createWebpackConfig = require('../utils/createWebpackConfig.js');

module.exports = createWebpackConfig({ entry: { 'lodash-functional': './lodash-functional.js' } }, 'fp', __dirname);
