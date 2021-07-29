const params = require('../params')

const configFieldsFromParams = ['organization', 'projectId', 'path', 'baseDir',
  'useGitBranchAsDefault', 'importEqSuggestions', 'autoApproveImported', 'diffWith',
  'skipUntranslatedStrings', 'skipAssignedStrings', 'translateHidden', 'contributors',
  'token', 'skipFormatStep']

module.exports = function () {
  return Object.entries(params).reduce((acc, [name, value]) => {
    if (configFieldsFromParams.includes(name)) return { ...acc, [name]: value }
    return acc
  }, {})
}
