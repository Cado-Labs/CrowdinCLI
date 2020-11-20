const api = require('../api')
const { skipUntranslatedStrings, exportWithMinApprovalsCount } = require('../config')
const abort = require('../utils/abort')

module.exports = async branchId => {
  try {
    const checkBuild = async buildId => {
      const { data: { status } } = await api.checkBuildStatus(buildId)
      if (status !== 'finished') await checkBuild(buildId)
    }
    const { data: { id } } = await api.buildProject({
      branchId,
      skipUntranslatedStrings,
      exportWithMinApprovalsCount,
    })
    await checkBuild(id)
    return id
  } catch (err) { abort(err) }
}
