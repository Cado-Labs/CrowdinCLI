const path = require('path')
const fs = require('fs')

module.exports = function (fileName) {
  return ((function checkInPath (pathArr) {
    const possiblePath = path.join(pathArr.join(path.sep), fileName)
    if (fs.existsSync(possiblePath)) return possiblePath
    if (pathArr.length) return checkInPath(pathArr.slice(0, -1))
    return null
  })(process.cwd().split(path.sep)))
}
