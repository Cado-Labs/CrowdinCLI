const simpleGit = require('simple-git')
const Logger = require('./Logger')
const params = require('./params')
const config = require('./config')
const api = require('./api')

const git = simpleGit()

class Branch {
  constructor (branchName, crowdinBranch) {
    this.branchName = branchName
    this.crowdinBranch = crowdinBranch
  }

  static async init () {
    const branchLogger = new Logger('Fetching branch info')
    try {
      await git.init()
      const gitBranch = await git.branch()
      const branchName = params.b || params.branch
        || (config.useGitBranchAsDefault ? gitBranch.current : 'master')
      const { data } = await api.listProjectBranches(branchName)
      const crowdinBranch = data[0] ? data[0].data : null
      branchLogger.success()
      return new Branch(branchName, crowdinBranch)
    } catch (e) { branchLogger.error(e) }
  }

  create = async (name = this.branchName) => {
    const createBranchLogger = new Logger(`Create branch ${name}`)
    if (this.exists) return
    try {
      this.crowdinBranch = (await api.createBranch(name)).data
      createBranchLogger.success()
    } catch (err) { createBranchLogger.error(err) }
  }

  get name () {
    if (this.branchName === 'master') return ''
    return this.branchName
  }

  get id () {
    if (this.branchName === 'master') return undefined
    if (!this.crowdinBranch) return null
    return this.crowdinBranch.id
  }

  get exists () {
    return this.branchName === 'master' || !!this.crowdinBranch
  }
}

module.exports = Branch
