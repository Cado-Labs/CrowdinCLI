const api = require('../api')
const {
  importEqSuggestions,
  autoApproveImported,
  markAddedTranslationsAsDone,
  translateHidden,
} = require('../config')

module.exports = (fileId, languageId, storageId) => api.uploadTranslation(languageId, {
  storageId,
  fileId,
  importEqSuggestions,
  autoApproveImported,
  markAddedTranslationsAsDone,
  translateHidden,
})
