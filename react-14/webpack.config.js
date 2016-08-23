const createWebpackConfig = require('../utils/createWebpackConfig.js');

module.exports = createWebpackConfig({ entry: { 'react-14': './react-with-touch.js' } }, 'React', __dirname);
