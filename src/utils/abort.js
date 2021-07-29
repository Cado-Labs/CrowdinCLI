const util = require('util')

function abort (...args) {
  const messages = args.map(a => (typeof a === 'object'
    ? util.inspect(a, { showHidden: false, depth: null })
    : a))
  // eslint-disable-next-line no-console
  console.log(...messages)
  process.exit(1)
}

module.exports = abort
