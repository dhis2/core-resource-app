const webpack = require('webpack');
const Visualizer = require('webpack-visualizer-plugin');

module.exports = function createWebpackConfig(partialConfig, libraryName, dirname) {
    return Object.assign({
        context: dirname,
        contentBase: dirname,
        devtool: 'source-map',
        output: {
            path: dirname + '/../build/',
            filename: '[name]/[name].js',
            publicPath: './',
            libraryTarget: 'var',
            library: libraryName,
        },
        plugins: [
            new Visualizer,
        ],
    }, partialConfig);
}
