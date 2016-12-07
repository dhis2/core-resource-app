const _ = require('lodash/fp');
const { install, getVersionsToInstall, repositories } = require('./utils/installer');

let libraries;

try {
    libraries = require('./libraries');
} catch(e) {
    console.error('No ./libraries.json file found.');
    process.exit(1);
}

const cdnLibraries = _.get('jsDelivr', libraries);
const npmLibraries = _.get('npm', libraries);

if (!npmLibraries && !cdnLibraries) { console.error('Nothing to install'); process.exit(1); }

const npmInstallations = _.map((libraryName) => (
    install(repositories.NPM, libraryName, './build', Promise.resolve(_.map(version => ({ version }), _.get(libraryName, npmLibraries))))
), _.keys(npmLibraries, npmLibraries));

const cdnInstallations = _.map((libraryName) => (
    install(repositories.CDN, libraryName, './build', getVersionsToInstall(libraryName, _.get(libraryName, cdnLibraries)))
), _.keys(cdnLibraries, cdnLibraries));

Promise.all(npmInstallations.concat(cdnInstallations))
    .then(() => {
        console.log('');
        console.log(`🙌  Great success!  🙌`);
        console.log('');
    })
    .catch(() => {
        console.log(`💩  One of the installs failed  💩`);
        process.exit(1);
    });
