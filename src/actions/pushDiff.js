const yaml = require('js-yaml')
const fs = require('fs')
const { diff } = require('deep-object-diff')
const git = require('simple-git')()
const path = require('path')
const uploadToStorage = require('../services/uploadToStorage')
const uploadFile = require('../services/uploadFile')
const uploadTranslation = require('../services/uploadTranslation')
const dumpPostprocess = require('../utils/dumpPostprocess')
const Logger = require('../Logger')
const { baseDir, diffWith } = require('../config')

module.exports = async (branch, { sourceFiles, sourceLocale }) => {
  const pushLogger = new Logger(`Pushing files diff to branch: ${branch.branchName}`)
  if (!branch.name || branch.name === 'master') pushLogger.error('This command not allowed from master branch')
  await git.init()
  const gdiff = await git.diff([diffWith || 'HEAD', baseDir])

  if (gdiff) pushLogger.error('You have uncommited files! Commit them before!')
  if (!branch.exists) await branch.create()

  // eslint-disable-next-line no-restricted-syntax
  for await (const filePath of sourceFiles) {
    try {
      const realPath = path.join(baseDir, filePath)
      const userFile = yaml.load(fs.readFileSync(realPath, 'utf-8'))
      await git.checkout('master', [realPath])
      const masterFile = yaml.load(fs.readFileSync(realPath, 'utf-8'))
      await git.checkout('HEAD', [realPath])
      const fileContent = diff(masterFile, userFile)
      const fileName = path.basename(filePath)
      const storageId = await uploadToStorage(dumpPostprocess(yaml.dump(fileContent)), fileName)
      const fileId = await uploadFile(branch, filePath, storageId)
      await uploadTranslation(fileId, sourceLocale.id, storageId)
    } catch (e) { pushLogger.error('error in push file diff', e) }
  }

  pushLogger.success()
}
