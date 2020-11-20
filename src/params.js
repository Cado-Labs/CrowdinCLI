const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

module.exports = yargs(hideBin(process.argv)).argv
