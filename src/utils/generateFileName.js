const abort = require('./abort')

module.exports = function (path, opts) {
  return path.replace(/%{(\w+)}/g, (f, match) => {
    if (!opts[match]) abort(`Var [${match}] don't exists in options`)
    return opts[match]
  })
}
