const _ = require('lodash/fp');
const lodashVersions = require('../libraries');
const { install, getVersionsToInstall } = require('../utils/installer');

install('rxjs', '../build', getVersionsToInstall('rxjs', _.get('js.rxjs', lodashVersions)));
