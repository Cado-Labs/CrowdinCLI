const path = require('path')
const fs = require('fs')

module.exports = () => {
  const packageInfo = fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8').toString()
  const { version } = JSON.parse(packageInfo)
  // eslint-disable-next-line no-console
  console.log(version)
  process.exit(0)
}
