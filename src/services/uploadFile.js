const path = require('path')
const abort = require('../utils/abort')
const createDirInCrowdin = require('./createDirInCrowdin')
const listProjectFiles = require('./listProjectFiles')
const api = require('../api')

module.exports = async (branch, filePath, storageId) => {
  const projectFiles = await listProjectFiles()
  const crowdinPath = path.join('/', branch.name, filePath)
  const file = projectFiles.find(({ data }) => data.path === crowdinPath)
  try {
    if (file) {
      await api.updateOrRestoreFile(file.data.id, { storageId })
      return file.data.id
    }
    const dirname = path.dirname(filePath).replace(/^\.?\/?/, '')
    const directoryId = await createDirInCrowdin(dirname, branch.id)
    const { data } = await api.createFile({
      name: path.basename(filePath),
      storageId,
      ...(directoryId ? { directoryId } : { branchId: branch.id }),
    })
    return data.id
  } catch (err) { abort(err) }
}
