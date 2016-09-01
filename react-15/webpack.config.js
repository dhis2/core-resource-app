const createWebpackConfig = require('../utils/createWebpackConfig.js');

module.exports = createWebpackConfig(__dirname)
    .withEntry('./react-with-touch.js')
    .withOutput({
        filename: 'react-15/react-15.js',
        library: 'React',
    })
    .build();
