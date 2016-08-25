const _ = require('lodash/fp');
const lodashVersions = require('../libraries');
const { install, getVersionsToInstall } = require('../utils/installer');

install('lodash', '../build', getVersionsToInstall('lodash', _.get('js.lodash', lodashVersions)));
