const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
const uploadToStorage = require('../services/uploadToStorage')
const uploadFile = require('../services/uploadFile')
const Logger = require('../Logger')
const dumpPostprocess = require('../utils/dumpPostprocess')
const filterValuesDeep = require('../utils/filterValuesDeep')
const { baseDir, doNotUploadTemplate } = require('../config')

const filterContent = content => {
  if (doNotUploadTemplate) {
    return filterValuesDeep(content, doNotUploadTemplate)
  }
  return content
}

module.exports = async (branch, { sourceFiles }) => {
  if (!branch.exists) await branch.create()
  // eslint-disable-next-line no-restricted-syntax
  for await (const filePath of sourceFiles) {
    const uploadSourceLogger = new Logger(`Uploading source file ${filePath}`)
    try {
      const fileName = path.basename(filePath)
      const realPath = path.join(baseDir, filePath)
      const fileContent = filterContent(yaml.load(fs.readFileSync(realPath, 'utf-8')))
      const storageId = await uploadToStorage(dumpPostprocess(yaml.dump(fileContent)), fileName)
      await uploadFile(branch, filePath, storageId)
      uploadSourceLogger.success()
    } catch (err) { uploadSourceLogger.error(err) }
  }
}
