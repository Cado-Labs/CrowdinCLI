const path = require('path')
const fs = require('fs')

module.exports = () => {
  // eslint-disable-next-line no-console
  console.log(fs.readFileSync(path.resolve(__dirname, '../../README.md'), 'utf8'))
  process.exit(0)
}
