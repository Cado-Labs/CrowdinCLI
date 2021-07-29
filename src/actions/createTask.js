const path = require('path')
const createAssignesList = require('../utils/createAssignesList')
const listProjectFiles = require('../services/listProjectFiles')
const config = require('../config')
const api = require('../api')
const params = require('../params')
const Logger = require('../Logger')

module.exports = async (branch, { sourceFiles, project, sourceLocale }) => {
  const prepareTaskLogger = new Logger(`Fetching branch [${branch.name}] translation progress`)
  const projectFiles = await listProjectFiles()
  try {
    const files = projectFiles.filter(({ data }) => (
      sourceFiles.some(sourcePath => (
        path.join('/', branch.name, sourcePath) === data.path
      ))
    ))
    if (!files.length) prepareTaskLogger.error('Upload files first')
    const { data: workflowSteps } = await api.getWorkflowSteps()
    const workflowProofreadStep = (workflowSteps.find(({ data }) => data.type === 'Proofread') || {}).data
    const workflowTranslateStep = (workflowSteps.find(({ data }) => data.type === 'Translate') || {}).data
    if (!workflowTranslateStep || !workflowProofreadStep) prepareTaskLogger.error('Setup workflow first!')
    const languages = params.languages || params.l
    const availableLangs = languages ? languages.replace(/\s+/g, '').split(',') : null
    const languagesForTask = project.targetLanguages.filter(({ twoLettersCode }) => (
      twoLettersCode === sourceLocale.twoLettersCode
        || !availableLangs || availableLangs.includes(twoLettersCode)
    ))
    const progress = await Promise.all(files.map(({ data }) => api.getFileProgress(data.id)))
    const langTranslatedMap = progress.reduce((acc, { data }) => (
      data.reduce((langAcc, { data: { languageId, words } }) => ({
        ...langAcc,
        [languageId]: !(langAcc[languageId] === false || words.total !== words.translated),
      }), acc)
    ), {})
    const assignees = createAssignesList()
    const fileIds = files.map(({ data }) => data.id)
    const { skipAssignedStrings } = config
    prepareTaskLogger.success()

    // eslint-disable-next-line no-restricted-syntax
    for await (const language of languagesForTask) {
      const { id, name } = language
      const translated = langTranslatedMap[id]
      const createTaskLogger = new Logger(`Create task for ${name}`)
      try {
        await api.addTask({
          title: `${branch.name && `[${branch.name}]`} ${name}`,
          languageId: id,
          fileIds,
          assignees,
          skipAssignedStrings,
          workflowStepId: translated ? workflowProofreadStep.id : workflowTranslateStep.id,
        })
        createTaskLogger.success()
      } catch (err) {
        if (err.error && err.error.code === 409) {
          createTaskLogger.success()
        } else {
          createTaskLogger.error(err)
        }
      }
    }
  } catch (err) { prepareTaskLogger.error(err) }
}
