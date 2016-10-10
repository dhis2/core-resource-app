const webpack = require('webpack');
const { isString } = require('lodash');

function withEntry(config, entry) {
    if (isString(entry)) {
        config.entry = entry;
    } else {
        config.entry = Object.assign(config.entry || {}, entry);
    }

    return config;
}

function withOutput(config, output) {
    config.output = Object.assign(config.output || {}, output);

    return config;
}

function withPlugins(config, plugins) {
    config.plugins = (config.plugins || []).concat(plugins);

    return config;
}

function build(config) {
    delete config.build;
    delete config.withPlugins;
    delete config.withOutput;
    delete config.withEntry;
    return config;
}

function createWebpackConfig(dirname) {
    const partialConfig = {
        context: dirname,
        // contentBase: dirname,
        devtool: 'source-map',
        output: {
            path: dirname + '/../build/',
            filename: '[name]/[name].js',
            publicPath: './',
            libraryTarget: 'var',
        },
    };

    partialConfig.withEntry = withEntry.bind(null, partialConfig);
    partialConfig.withOutput = withOutput.bind(null, partialConfig);
    partialConfig.withPlugins =  withPlugins.bind(null, partialConfig);
    partialConfig.build = build.bind(null, partialConfig);

    return partialConfig;
}


module.exports = createWebpackConfig;
