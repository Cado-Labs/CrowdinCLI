const path = require('path')
const fs = require('fs')
const decompress = require('decompress')
const git = require('simple-git')()
const generateFileName = require('../utils/generateFileName')
const downloadFile = require('../utils/downloadFile')
const buildProject = require('../services/buildProject')
const api = require('../api')
const { baseDir, path: basePath, skipFormatStep } = require('../config')
const Logger = require('../Logger')
const formatFiles = require('../services/formatFiles')

module.exports = async (branch, projectData) => {
  const { project, sourceFiles } = projectData
  const downloadLogger = new Logger('Downloading all project files')
  if (!branch.exists) downloadLogger.error(`Branch [${branch.name}] don't exists in Crowdin. Upload first!`)

  const { targetLanguages } = project
  const tmpZipPath = path.join(baseDir, '__tmp__.zip')
  const tmpUnzipPath = path.join(baseDir, '__tmp_unzipped__')
  const gdiff = await git.diff(['HEAD', baseDir])

  if (gdiff) downloadLogger.error('You have uncommited files! Commit them before!')

  try {
    const buildId = await buildProject(branch.id)
    const { data: { url } } = await api.downloadTranslations(buildId)
    await downloadFile(url, tmpZipPath)
    downloadLogger.success()
  } catch (err) { downloadLogger.error(err) }

  const unzipLogger = new Logger('Unzip files')
  try {
    await decompress(tmpZipPath, tmpUnzipPath)
    targetLanguages.forEach(language => {
      const { id } = language
      sourceFiles.forEach(sourcePath => {
        const sourceDirname = path.dirname(sourcePath)
        const fileName = generateFileName(path.basename(basePath), language)
        const inputPath = path.join(tmpUnzipPath, id, sourcePath)
        const outputPath = path.join(baseDir, sourceDirname, fileName)

        fs.renameSync(inputPath, outputPath)
      })
    })

    fs.rmdirSync(tmpUnzipPath, { recursive: true })
    fs.unlinkSync(tmpZipPath)
    unzipLogger.success()
  } catch (err) { unzipLogger.error(err) }

  if (!skipFormatStep) {
    const formatLogger = new Logger('Folmating files')
    formatFiles(branch, projectData)
    formatLogger.success()
  }
}
