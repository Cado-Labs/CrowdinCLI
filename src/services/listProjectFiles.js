const abort = require('../utils/abort')
const api = require('../api')

module.exports = async () => {
  try {
    const { data } = await api.listProjectFiles()
    return data
  } catch (err) { abort(err) }
}
