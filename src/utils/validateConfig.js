const config = require('../config')
const abort = require('./abort')

const requiredFields = ['token', 'organization', 'projectId', 'baseDir', 'path']

module.exports = function () {
  const missingField = requiredFields.find(field => !config.hasOwnProperty(field))
  if (missingField) abort(`Missed [${missingField}]. Provide it in config or params!`)
}
