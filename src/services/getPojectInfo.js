const glob = require('glob')
const generateFileName = require('../utils/generateFileName')
const Logger = require('../Logger')
const api = require('../api')
const { baseDir, path: basePath, projectId } = require('../config')
const params = require('../params')

module.exports = async function () {
  const fetchProjectLogger = new Logger('Fetching project info')
  try {
    const { data: project } = await api.getProject(projectId)
    const { targetLanguages, sourceLanguageId } = project
    const { data: sourceLocale } = await api.getLanguage(sourceLanguageId)
    const globPath = generateFileName(basePath, sourceLocale)
    const globSourceFiles = glob.sync(globPath, { root: baseDir, cwd: baseDir })
    const sourceFiles = globSourceFiles.map(path => path.replace(baseDir, ''))
    const languages = params.languages || params.l
    const availableLangs = languages ? languages.replace(/\s+/g, '').split(',') : null
    const languagesForTranslate = targetLanguages.filter(({ twoLettersCode }) => (
      twoLettersCode === sourceLocale.twoLettersCode
      || !availableLangs || availableLangs.includes(twoLettersCode)
    ))
    const filesToTranslate = languagesForTranslate.reduce((acc, language) => ([
      ...acc,
      ...glob.sync(
        generateFileName(basePath, language),
        { root: baseDir, cwd: baseDir },
      ).map(filePath => ({
        filePath,
        languageId: language.id,
      })),
    ]), [])
    fetchProjectLogger.success()
    return { project, sourceLocale, sourceFiles, filesToTranslate }
  } catch (err) { fetchProjectLogger.error(err) }
}
