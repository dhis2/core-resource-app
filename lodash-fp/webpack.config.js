const createWebpackConfig = require('../utils/createWebpackConfig.js');
const version = require('./package.json').version;

module.exports = createWebpackConfig(__dirname)
    .withEntry('./lodash-functional.js')
    .withOutput({
        filename: `lodash-functional/${version}/lodash-functional.js`,
    })
    .build();
