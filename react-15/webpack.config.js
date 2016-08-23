const createWebpackConfig = require('../utils/createWebpackConfig.js');

module.exports = createWebpackConfig({ entry: { 'react-15': './react-with-touch.js' } }, 'React', __dirname);
