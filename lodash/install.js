const lodashVersions = require('../versions').lodash;
const { install, getVersionsToInstall } = require('../utils/installer');

install('lodash', '../build', getVersionsToInstall('lodash', lodashVersions));
