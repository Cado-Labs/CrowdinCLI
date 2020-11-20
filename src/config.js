const findFileInParentDir = require('./utils/findFileInParentDir')
const loadConfig = require('./utils/loadConfig')
const makeConfigFromParams = require('./utils/makeConfigFromParams')
const { GLOBAL_CONFIG, PROJECT_CONFIG } = require('./constans/config')
const params = require('./params')

const config = params.c || params.config
const projectConfig = loadConfig(config || findFileInParentDir(PROJECT_CONFIG))
const globalConfig = loadConfig(findFileInParentDir(GLOBAL_CONFIG))

module.exports = (() => ({
  ...globalConfig,
  ...projectConfig,
  ...makeConfigFromParams(),
}))()
