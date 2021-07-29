const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const { baseDir } = require('../config')
const abort = require('../utils/abort')
const dumpPostprocess = require('../utils/dumpPostprocess')
const dumpOptions = require('../constans/dumpOptions')

module.exports = async (branch, { filesToTranslate }) => {
  try {
    filesToTranslate.forEach(({ filePath }) => {
      const realPath = path.join(baseDir, filePath)
      const fileContent = yaml.load(fs.readFileSync(realPath, 'utf-8'))
      const postprocessedFile = dumpPostprocess(yaml.dump(fileContent, dumpOptions))
      fs.writeFileSync(realPath, yaml.dump(yaml.load(postprocessedFile), dumpOptions))
    })
  } catch (e) { abort(e) }
}
