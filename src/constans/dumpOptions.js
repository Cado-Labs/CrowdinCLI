const { dumpOptions } = require('../config')

module.exports = {
  lineWidth: -1,
  noRefs: true,
  quotingType: "'",
  ...(dumpOptions || {}),
}
