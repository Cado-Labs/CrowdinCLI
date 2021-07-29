const fs = require('fs')
const git = require('simple-git')()
const path = require('path')
const decompress = require('decompress')
const { baseDir, path: basePath } = require('../config')
const api = require('../api')
const downloadFile = require('../utils/downloadFile')
const buildProject = require('../services/buildProject')
const generateFileName = require('../utils/generateFileName')
const mergeAndSave = require('../utils/mergeAndSave')
const Logger = require('../Logger')

module.exports = async (branch, { sourceFiles, project }) => {
  const pullLogger = new Logger(`Pulling files diff from branch: ${branch.name}`)
  if (branch.gitName === 'master') pullLogger.error('This command not allowed from master branch')
  if (!branch.exists) pullLogger.error(`Branch [${branch.name}] don't exists in Crowdin. Upload first!`)

  const { targetLanguages } = project
  const tmpZipPath = path.join(baseDir, '__tmp__.zip')
  const tmpUnzipPath = path.join(baseDir, '__tmp_unzipped__')
  await git.init()
  const gdiff = await git.diff(['HEAD', baseDir])

  if (gdiff) pullLogger.error('You have uncommited files! Commit them before!')

  try {
    const buildId = await buildProject(branch.id)
    const { data: { url } } = await api.downloadTranslations(buildId)
    await downloadFile(url, tmpZipPath)
    pullLogger.success()
  } catch (e) { pullLogger.error(e) }

  const unzipLogger = new Logger('Unzipping files')
  try {
    await decompress(tmpZipPath, tmpUnzipPath)
    targetLanguages.forEach(language => {
      const { id } = language
      sourceFiles.forEach(sourcePath => {
        const sourceDirname = path.dirname(sourcePath)
        const fileName = generateFileName(path.basename(basePath), language)
        const inputPath = path.join(tmpUnzipPath, id, sourcePath)
        const outputPath = path.join(baseDir, sourceDirname, fileName)
        mergeAndSave(inputPath, outputPath)
      })
    })

    fs.rmdirSync(tmpUnzipPath, { recursive: true })
    fs.unlinkSync(tmpZipPath)
    unzipLogger.success()
  } catch (e) { unzipLogger.error(e) }
}
