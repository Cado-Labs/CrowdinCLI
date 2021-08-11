const yaml = require('js-yaml')
const fs = require('fs')
const merge = require('deepmerge')
const dumpPostprocess = require('./dumpPostprocess')
const dumpOptions = require('../constans/dumpOptions')

module.exports = (inputPath, outputPath) => {
  const inputFile = yaml.load(fs.readFileSync(inputPath, 'utf-8')) || {}
  const outputFile = yaml.load(fs.readFileSync(outputPath, 'utf-8')) || {}
  const inputFileEntries = Object.entries(inputFile)
  // If no one translation approved in Crowdin we download not empty file
  // Crowdin files without approvals look as `{en: null}`
  // Crowdin files without translation look as `{}`
  // And we don't want merge this in our translations
  const mergedData = inputFileEntries.length === 1 && (
    inputFileEntries[0][1] === null
    || inputFileEntries[0][1] === '{}'
  )
    ? outputFile
    : merge(outputFile, inputFile)
  fs.writeFileSync(outputPath, dumpPostprocess(yaml.dump(mergedData, dumpOptions)))
}
