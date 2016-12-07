const _ = require('lodash/fp');
const { install, getVersionsToInstall } = require('./utils/installer');

let libraries;

try {
    libraries = require('./libraries');
} catch(e) {
    console.error('No ./libraries.json file found.');
    process.exit(1);
}

const jsLibraries = _.get('jsdelivr', libraries);

if (!jsLibraries) { console.error('Nothing to install'); process.exit(1); }

const installations = _.map((libraryName) => (
    install(libraryName, './build', getVersionsToInstall(libraryName, _.get(libraryName, jsLibraries)))
), _.keys(jsLibraries, jsLibraries));

Promise.all(installations)
    .then(() => {
        console.log('');
        console.log(`🙌  Great success!  🙌`);
        console.log('');
    })
    .catch(() => {
        console.log(`💩  One of the installs failed  💩`);
        process.exit(1);
    });
