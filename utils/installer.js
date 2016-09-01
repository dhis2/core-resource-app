const fetch = require('node-fetch');
const _ = require('lodash/fp');
const writeFileSync = require('fs').writeFileSync;
const exec = require('child_process').exec;
const jsdelivr = require('jsdelivr');

function spy(v) {
    console.log(v);
    return v;
}

function mkdirp(path) {
    return new Promise((resolve, reject) => {
        const command = `mkdir -p "${path}"`;
        const options = {};

        function callback(error /*, stdout, stderr */) {
            if (error) {
                reject(error);
            }
            resolve(path);
        }
        exec(command, options, callback);
    });
}

const getLibraryInfo = (libraryName) => fetch(`https://api.jsdelivr.com/v1/jsdelivr/libraries?name=${libraryName}`).then(response => response.json());
const waitForAllToResolve = (promises) => Promise.all(promises);
const fetchFromCDN = _.curry((libraryName, version, filename) => fetch(`https://cdn.jsdelivr.net/${libraryName}/${version}/${filename}`));
const getFileContent = _.curry((library, version, file) => Promise
    .resolve(fetchFromCDN(library, version, file))
    .then(response => response.buffer())
    .then(content => ({
        file,
        content,
    })));

const getFileAssets = _.curry((library, { version, files }) => {
    return Promise
        .all(files.map(getFileContent(library, version)))
        .then(files => ({
            version,
            files,
        }));
});

const writeToDisk = _.curry((folder, filename, contentStream) => {
    return mkdirp(folder)
        .then(() => {
            writeFileSync(`${folder}/${filename}`, contentStream)
            return `${folder}/${filename}`;
        });
});

const promisify = _.curry((func, promise) => Promise.resolve(promise).then(func));
const extractCDNPayload = promisify(_.compose(_.get('assets'), _.first));
const createVersionsObject = promisify(_.groupBy(_.get('version')));
const getLibraryVersions = _.compose(createVersionsObject, extractCDNPayload);
const versionNotAvailable = version => console.warn(`WARNING: Version ${version} is not available on the CDN`);
const getLibraryVersionsFromCDN = (libraryName) => getLibraryVersions(getLibraryInfo(libraryName));
const filterNeededVersions = (versions) => promisify(_.compose(_.flatten, _.values, _.pick(versions)));
const warnForNonExistentVersions = _.curry((versionsToLoad, versionsLoaded) => {
    versionsToLoad
        .filter(version => Object.keys(versionsLoaded).indexOf(version) === -1)
        .forEach(versionNotAvailable);

    return versionsLoaded;
});

function writeInstallSummary(versions) {
    versions.forEach(({version, files}) => {
        console.log('');
        console.log(`For version ${version} installed:`);
        files.forEach(filename => console.log(` - ${filename}`));
    });

    return versions;
}

const loadAllFileAssetsFromCDN = (library) => _.compose(waitForAllToResolve, _.map(getFileAssets(library)));
const writeAllFileAssetsToBuildFolder = (buildFolder, library) => _.compose(waitForAllToResolve, _.map(({ version, files }) => Promise.all(_.map(({file, content}) => writeToDisk(`${buildFolder}/${library}/${version}`, file, content), files)).then(files => ({files, version}))))

const install = _.curry((library, buildFolder, versionPromise) => {
    return Promise.resolve(versionPromise)
        .then(loadAllFileAssetsFromCDN(library))
        .then(writeAllFileAssetsToBuildFolder(buildFolder, library))
        .then(writeInstallSummary)
        .catch(error => {
            console.error('Something went wrong during the install', error);
            return Promise.reject(error);
        });
});

const getVersionsToInstall = _.curry((library, versions) => _.compose(filterNeededVersions(versions), promisify(warnForNonExistentVersions(versions)))(getLibraryVersionsFromCDN(library)));

module.exports = {
    getVersionsToInstall,
    install,
};
