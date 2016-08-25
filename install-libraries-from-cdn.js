const _ = require('lodash/fp');
const { install, getVersionsToInstall } = require('./utils/installer');

let libraries;

try {
    libraries = require('./libraries');
} catch(e) {
    console.error('No ./libraries.json file found.');
    process.exit(1);
}

const jsLibraries = _.get('js', libraries);

if (!jsLibraries) { console.error('Nothing to install'); process.exit(1); }

_.map((libraryName) => {
    install(libraryName, './build', getVersionsToInstall(libraryName, _.get(libraryName, jsLibraries)));
}, _.keys(jsLibraries, jsLibraries));
