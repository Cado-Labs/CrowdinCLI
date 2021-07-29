const path = require('path')
const fs = require('fs')
const abort = require('../utils/abort')
const { GLOBAL_CONFIG } = require('../constans/config')
const params = require('../params')

const fileName = path.join(process.cwd(), GLOBAL_CONFIG)

module.exports = ({ token } = params) => {
  if (!token) abort('Run crowdin init with "--token" param.')
  fs.writeFileSync(fileName, JSON.stringify({ token }))
  // eslint-disable-next-line no-console
  console.log('Crowdin initialized.')
  process.exit(0)
}
