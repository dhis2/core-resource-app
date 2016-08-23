const lodashVersions = require('../versions').rxjs;
const { install, getVersionsToInstall } = require('../utils/installer');

install('rxjs', '../build', getVersionsToInstall('rxjs', lodashVersions));
