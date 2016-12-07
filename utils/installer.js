const colors = require('colors/safe');
const fetch = require('node-fetch');
const _ = require('lodash/fp');
const writeFileSync = require('fs').writeFileSync;
const fileExistsSync = require('fs').existsSync;
const createReadStream = require('fs').createReadStream;
const exec = require('child_process').exec;
const unzip = require('unzip');

const CACHE_LOCATION = `./.core-resource-cache`;

// set theme
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

function spy(v) {
    console.log(v);
    return v;
}

function log(...messages) {
    console.log(...messages);
}

/**
 * Promise version of `mkdir -p`
 * 
 * @param {string} path Path where the new folder should be created.
 * 
 * @returns {Promise} Resolves when the new directory was created
 */
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

/**
 * Attempts to download a zipfile for a specific version of a dependency
 * 
 * @param {string} dependencyName The name of the dependency to download. e.g `jquery`
 * @param {string} version The version of the dependenncy. e.g. `1.14.0`
 * 
 * @returns {Promise} Fetch result for the zip file for the library
 */
const fetchZipForDependency = (dependencyName, version) => fetch(`https://cdn.jsdelivr.net/${dependencyName}/${version}/${dependencyName}.zip`);

/**
 * @returns {Promise} Resolves when the directory is created correctly
 */
function createFolder(folder) {
    return mkdirp(folder);
}

/**
 * @returns {Promise} Returns the location where in the local cache the library zipfile would be stored
 */
function getCachePathLocationForDependency(dependencyName, version) {
    return `${CACHE_LOCATION}/${dependencyName}/${version}`;
}

function getCacheFileLocationForDependency(dependencyName, version) {
    return `${getCachePathLocationForDependency(dependencyName, version)}/${dependencyName}.zip`;
}

const createFolderInCacheForLibrary = (libraryName, version) => createFolder(getCachePathLocationForDependency(libraryName, version)); 

const getDependency = _.curry((libraryName, { version }) => {
    const cachePath = getCacheFileLocationForDependency(libraryName, version);

    // If we already have a local file we use that
    if (fileExistsSync(cachePath)) {
        return Promise.resolve({
            name: libraryName,
            version,
            location: cachePath,
        });
    }

    log(`🚚  Downloading ${libraryName}`);
    // When no local file is available we'll download it first
    return fetchZipForDependency(libraryName, version)
        .then(response => response.buffer())
        .then((contentBuffer) => createFolderInCacheForLibrary(libraryName, version).then(() => contentBuffer))
        .then(contentBuffer => {
            writeFileSync(cachePath, contentBuffer);
            
            return {
                name: libraryName,
                version,
                location: cachePath,
            };
        });
});

const writeToDisk = _.curry((buildFolder, folder, filename, contentStream) => {
    return createCacheFolderPromise
        .then(() => Promise.all([mkdirp(`${buildFolder}/${folder}`), mkdirp(`${CACHE_LOCATION}/${folder}/$`)])) 
        .then(() => {
            if (filename.split('/').length > 1) {
                const filePath = filename.split('/');
                filePath.pop(); // Remove the filename from the path

                return Promise.all([mkdirp(`${buildFolder}/${folder}/${filePath.join('/')}`), mkdirp(`${CACHE_LOCATION}/${folder}/${filePath.join('/')}`)]);
            }
            return true;
        })
        .then(() => {
            writeFileSync(`${buildFolder}/${folder}/${filename}`, contentStream);
            writeFileSync(`${CACHE_LOCATION}/${folder}/${filename}`, contentStream);
            return `${buildFolder}/${folder}/${filename}`;
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
    const unavailableVersions = versionsToLoad
        .filter(version => Object.keys(versionsLoaded).indexOf(version) === -1);

    if (unavailableVersions.length > 0) {
        throw new Error(`The following versions are not available ${unavailableVersions.join(',')}`);
    }

    return versionsLoaded;
});

function writeInstallSummary(versions) {
    versions.forEach(({version, files}) => {
        console.log(colors.info(`For version ${version} installed:`));
        files.forEach(filename => console.log(colors.data(` - ${filename}`)));
    });

    return versions;
}

function writeLibraryName(library) {
    log('🚀  ' + colors.verbose(library));
    return library;
}

const retreiveLibraryVersionZipFiles = (library) => _.compose(waitForAllToResolve, _.map(getDependency(library)));

const installIntoBuildDirectory = _.curry((buildFolder, dependencyName, packageVersions) => {
    log(`💾  Unpacking for ${dependencyName} `);
    
    const writePromises = _.map(({ name, version, location }) => new Promise((resolve, reject) => {
        createReadStream(location)
            .pipe(unzip.Extract({ path: `${buildFolder}/${name}/${version}` }))
            .on('error', (error) => reject(error))
            .on('finish', () => resolve({ name, version, location: `${buildFolder}/${name}/${version}` })); 
    }), packageVersions);
    
    return Promise.all(writePromises);
});

const install = _.curry((library, buildFolder, versionPromise) => {
    writeLibraryName(library);

    return Promise.resolve(versionPromise)
        .then(retreiveLibraryVersionZipFiles(library))
        .then(installIntoBuildDirectory(buildFolder, library))
        .then((versions) => {
            log(`🌮  ${library}`)
            _.forEach(({ version }) => log(colors.data(`  - ${version}`)), versions);
        })
        .catch(error => {
            console.error(`Something went wrong during the installation of ${library}: `, error);
            return Promise.reject(error);
        });
});

const getVersionsToInstall = _.curry((library, versions) => {
    const failForNonExistentVersions = promisify(warnForNonExistentVersions(versions))

    return _.compose(filterNeededVersions(versions), failForNonExistentVersions)(getLibraryVersionsFromCDN(library))
});

module.exports = {
    getVersionsToInstall,
    install,
};
