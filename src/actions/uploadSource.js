const uploadToStorage = require('../services/uploadToStorage')
const uploadFile = require('../services/uploadFile')
const Logger = require('../Logger')

module.exports = async (branch, { sourceFiles }) => {
  if (!branch.exists) await branch.create()
  // eslint-disable-next-line no-restricted-syntax
  for await (const filePath of sourceFiles) {
    const uploadSourceLogger = new Logger(`Uploading source file ${filePath}`)
    try {
      const storageId = await uploadToStorage(filePath)
      await uploadFile(branch, filePath, storageId)
      uploadSourceLogger.success()
    } catch (err) { uploadSourceLogger.error(err) }
  }
}
