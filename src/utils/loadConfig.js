const fs = require('fs')
const path = require('path')

function makeBaseDirFromConfigPath (baseDir, configPath) {
  if (!baseDir || !configPath) return ''
  if (path.isAbsolute(baseDir)) return baseDir
  return path.resolve(path.dirname(configPath), baseDir)
}

module.exports = function (configPath) {
  if (!fs.existsSync(configPath)) return {}
  const loadedConfig = JSON.parse(fs.readFileSync(configPath).toString())
  return {
    ...loadedConfig,
    baseDir: makeBaseDirFromConfigPath(loadedConfig.baseDir, configPath),
  }
}
