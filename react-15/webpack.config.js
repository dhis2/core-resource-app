const webpack = require('webpack');
const version = require('react/package.json').version;
const createWebpackConfigForReact = require('../utils/createWebpackConfigForReact.js');

module.exports = createWebpackConfigForReact(__dirname, version);