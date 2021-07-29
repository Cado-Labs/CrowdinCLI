const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
const { diff } = require('deep-object-diff')
const git = require('simple-git')()
const uploadToStorage = require('../services/uploadToStorage')
const uploadTranslation = require('../services/uploadTranslation')
const listProjectFiles = require('../services/listProjectFiles')
const dumpPostprocess = require('../utils/dumpPostprocess')
const Logger = require('../Logger')
const { baseDir, diffWith } = require('../config')

module.exports = async (branch, { filesToTranslate, sourceFiles }) => {
  const prepareUploadLogger = new Logger('Prepare project to upload')
  if (!branch.exists) prepareUploadLogger.error(`Create branch ${branch.name} and upload source first!`)
  const projectFiles = await listProjectFiles()
  await git.init()
  prepareUploadLogger.success()

  // eslint-disable-next-line no-restricted-syntax
  for await (const { filePath, languageId } of filesToTranslate) {
    const uploadLogger = new Logger(`Uploading translations for [${languageId}] from file [${filePath}]`)
    try {
      const sourceFilePath = sourceFiles.find(p => path.dirname(p) === path.dirname(filePath))
      const sourceFile = projectFiles.find(({ data }) => data.path === path.join('/', branch.name, sourceFilePath))
      if (!sourceFile) throw new Error(`Upload source file first ${filePath}`)
      const { data: { id: fileId } } = sourceFile
      let isPossibleToCheckout = !!diffWith
      if (isPossibleToCheckout) {
        try {
          await git.show(diffWith)
        } catch { isPossibleToCheckout = false }
      }

      if (isPossibleToCheckout) {
        const realPath = path.join(baseDir, filePath)
        const currentFile = yaml.load(fs.readFileSync(realPath, 'utf-8'))
        await git.checkout(diffWith, [realPath])
        await git.checkout(diffWith, [realPath])
        const diffFile = yaml.load(fs.readFileSync(realPath, 'utf-8'))
        await git.checkout('HEAD', [realPath])
        const fileContent = diff(diffFile, currentFile)
        const fileName = path.basename(realPath)
        const storageId = await uploadToStorage(dumpPostprocess(yaml.dump(fileContent)), fileName)
        await uploadTranslation(fileId, languageId, storageId)
        uploadLogger.success()
      } else {
        const storageId = await uploadToStorage(filePath)
        await uploadTranslation(fileId, languageId, storageId)
        uploadLogger.success()
      }
    } catch (err) { uploadLogger.error(err) }
  }
}
