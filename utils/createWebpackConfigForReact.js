const webpack = require('webpack');
const path = require('path');
const createWebpackConfig = require('./createWebpackConfig.js');

const isProduction = process.argv.includes('-p');

function getPluginsForBuild() {
    if (isProduction) {
        return [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false,
                }
            })
        ];
    }

    return [];
} 


module.exports = function createWebpackConfigForReact(directory, version) {
    return createWebpackConfig(directory)
    .withEntry(path.join(directory, 'react-with-touch.js'))
    .withOutput({
        filename: `react/${version}/react-with-touch-tap-plugin${isProduction ? '.min' : ''}.js`, // filename: 'react-14/react-14.js',
        library: 'React',
    })
    .withPlugins(getPluginsForBuild())
    .build();
}