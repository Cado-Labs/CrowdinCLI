const path = require('path')
const abort = require('../utils/abort')
const api = require('../api')

module.exports = async (dirname, branchId) => {
  if (!dirname) return null
  const splitDir = dirname.split(path.sep)
  async function createDir (step = 0, directoryId) {
    if (step === splitDir.length) return directoryId
    try {
      const { data } = await api.createDir({
        name: splitDir[step],
        ...(directoryId ? { directoryId } : { branchId }),
      })
      return createDir(step + 1, data.id)
    } catch (err) { abort(err) }
  }
  return createDir()
}
