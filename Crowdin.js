const path = require('path')
const uploadSource = require('./src/actions/uploadSource')
const uploadTranslations = require('./src/actions/uploadTranslations')
const downloadTranslations = require('./src/actions/downloadTranslations')
const pushDiff = require('./src/actions/pushDiff')
const pullDiff = require('./src/actions/pullDiff')
const getPojectInfo = require('./src/services/getPojectInfo')
const deleteBranch = require('./src/actions/deleteBranch')
const createTask = require('./src/actions/createTask')
const lint = require('./src/actions/lint')
const validateConfig = require('./src/utils/validateConfig')
const abort = require('./src/utils/abort')
const Branch = require('./src/branch')
const config = require('./src/config')
const params = require('./src/params')

class Crowdin {
  constructor (branch, projectData) {
    this._branch = branch
    this._projectData = projectData
  }

  static async init () {
    validateConfig()
    const branch = await Branch.init()
    const projectData = await getPojectInfo()
    return new Crowdin(branch, projectData)
  }

  checkIsPossibleToUpdateBranch () {
    const providedBranch = params.b || params.branch
    if (!config.useGitBranchAsDefault || providedBranch) return
    if (this._branch.gitName === 'master') {
      abort('Cannot run this command from master branch. Provide branch name "-b master" or use another git branch.')
    }
  }

  pushDiff () {
    this.checkIsPossibleToUpdateBranch()
    return pushDiff(this._branch, this._projectData)
  }

  pullDiff () {
    this.checkIsPossibleToUpdateBranch()
    return pullDiff(this._branch, this._projectData)
  }

  async uploadAll () {
    this.checkIsPossibleToUpdateBranch()
    await uploadSource(this._branch, this._projectData)
    return uploadTranslations(this._branch, this._projectData)
  }

  async downloadAll () {
    this.checkIsPossibleToUpdateBranch()
    return downloadTranslations(this._branch, this._projectData)
  }

  task () {
    this.checkIsPossibleToUpdateBranch()
    return createTask(this._branch, this._projectData)
  }

  deleteBranch () {
    this.checkIsPossibleToUpdateBranch()
    return deleteBranch(this._branch)
  }

  lint () {
    return lint(this._branch, this._projectData)
  }

  uploadSource () {
    this.checkIsPossibleToUpdateBranch()
    return uploadSource(this._branch, this._projectData)
  }

  uploadTranslations () {
    this.checkIsPossibleToUpdateBranch()
    return uploadTranslations(this._branch, this._projectData)
  }

  // Dot't use comands/getters below.
  // Just added for comability with old versions
  async sync () {
    this.checkIsPossibleToUpdateBranch()
    await uploadSource(this._branch, this._projectData)
    await uploadTranslations(this._branch, this._projectData)
    return downloadTranslations(this._branch, this._projectData)
  }

  get branch () { return this._branch }

  get files () {
    const { filesToTranslate } = this._projectData
    return filesToTranslate.map(({ filePath }) => path.join(config.baseDir, filePath))
  }
}

module.exports = Crowdin
