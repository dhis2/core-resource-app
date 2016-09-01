const createWebpackConfig = require('../utils/createWebpackConfig.js');

module.exports = createWebpackConfig(__dirname)
    .withEntry('./lodash-functional.js')
    .withOutput({
        filename: 'lodash-functional/lodash-functional.js',
        library: 'fp',
    })
    .build();
