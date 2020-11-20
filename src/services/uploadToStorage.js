const fs = require('fs')
const path = require('path')
const { baseDir } = require('../config')
const api = require('../api')
const abort = require('../utils/abort')

module.exports = async (filePathOrContent, name) => {
  const fileName = name || path.basename(filePathOrContent)
  try {
    const source = name
      ? filePathOrContent
      : fs.readFileSync(path.join(baseDir, filePathOrContent))
    const { data } = await api.uploadToStorage(fileName, source)
    return data.id
  } catch (err) { abort(err) }
}
