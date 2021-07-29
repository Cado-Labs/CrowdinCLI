const yaml = require('js-yaml')
const fs = require('fs')
const diffUtil = require('diff')
const git = require('simple-git')()
const path = require('path')
const { baseDir } = require('../config')
const { fix } = require('../params')
const Logger = require('../Logger')
const dumpOptions = require('../constans/dumpOptions')
const dumpPostprocess = require('../utils/dumpPostprocess')
const formatFiles = require('../services/formatFiles')
const deleteBranch = require('./deleteBranch')

module.exports = async (branch, project) => {
  const { filesToTranslate } = project
  const lintLogger = new Logger('Linting files \n')
  await git.init()
  const gdiff = await git.diff(['HEAD', baseDir])

  if (gdiff && fix) lintLogger.error('You have uncommited files! Commit them before!')

  try {
    const differenceArray = filesToTranslate.reduce((acc, { filePath }) => {
      const realPath = path.join(baseDir, filePath)
      const unparsedFile = fs.readFileSync(realPath, 'utf-8')
      const fileContent = yaml.load(unparsedFile)
      const postprocessedFile = dumpPostprocess(yaml.dump(fileContent, dumpOptions))
      const dumpedNewFile = yaml.dump(yaml.load(postprocessedFile), dumpOptions)
      const difference = diffUtil.diffTrimmedLines(unparsedFile, dumpedNewFile)
      const filteredDiff = difference.filter(diff => diff.hasOwnProperty('added')
        && diff.hasOwnProperty('removed'))
      return [
        ...acc,
        ...(filteredDiff.length ? [difference.reduce((logAcc, { value, removed, added }) => {
          if (removed) return `${logAcc}[change this]: ${value}`
          if (added) return `${logAcc}[on this]    : ${value}\n`

          return logAcc
        }, `File: [${filePath}]\n`)] : []),
      ]
    }, [])
    if (!fix && differenceArray.length) lintLogger.error(differenceArray.join('\n\n'))
    if (!fix && branch.name && branch.exists) lintLogger.error(`Branch [${branch.name}] exists in crowdin.`)
    lintLogger.success()
    if (fix) {
      if (differenceArray.length) await formatFiles(branch, project)
      if (branch.name && branch.exists) await deleteBranch(branch)
    }
  } catch (e) { lintLogger.error(e) }
}
