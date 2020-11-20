const api = require('../api')
const Logger = require('../Logger')

module.exports = async branch => {
  const branchLogger = new Logger(`Delete crowdin branch ${branch.name}`)
  if (!branch.exists) branchLogger.error('Create branch first')
  try {
    await api.deleteBranch(branch.id)
    branchLogger.success()
  } catch (err) { branchLogger.error(err) }
}
