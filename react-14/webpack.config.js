const createWebpackConfig = require('../utils/createWebpackConfig.js');

module.exports = createWebpackConfig(__dirname)
    .withEntry('./react-with-touch.js')
    .withOutput({
        filename: 'react-14/react-14.js',
        library: 'React',
    })
    .build();
