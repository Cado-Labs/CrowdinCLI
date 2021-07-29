const { default: Crowdin } = require('@crowdin/crowdin-api-client')
const config = require('./config')

const { token, organization, projectId } = config
const {
  projectsGroupsApi,
  sourceFilesApi,
  uploadStorageApi,
  translationsApi,
  workflowsApi,
  translationStatusApi,
  tasksApi,
  languagesApi,
} = new Crowdin({ token, organization })

module.exports = {
  getProject: () => projectsGroupsApi.getProject(projectId),
  getLanguage: languageId => languagesApi.getLanguage(languageId),
  listProjectFiles: () => sourceFilesApi.withFetchAll().listProjectFiles(projectId),
  listProjectBranches: name => sourceFilesApi.listProjectBranches(projectId, name),
  uploadToStorage: (name, source) => uploadStorageApi.addStorage(name, source),
  createBranch: name => sourceFilesApi.createBranch(projectId, { name }),
  createDir: data => sourceFilesApi.createDirectory(projectId, data),
  // eslint-disable-next-line max-len
  updateOrRestoreFile: (fileId, data) => sourceFilesApi.updateOrRestoreFile(projectId, fileId, data),
  createFile: data => sourceFilesApi.createFile(projectId, data),
  // eslint-disable-next-line max-len
  uploadTranslation: (languageId, data) => translationsApi.uploadTranslation(projectId, languageId, data),
  buildProject: data => translationsApi.buildProject(projectId, data),
  checkBuildStatus: buildId => translationsApi.checkBuildStatus(projectId, buildId),
  downloadTranslations: buildId => translationsApi.downloadTranslations(projectId, buildId),
  deleteBranch: branchId => sourceFilesApi.deleteBranch(projectId, branchId),
  getWorkflowSteps: () => workflowsApi.getList(`${workflowsApi.url}/projects/${projectId}/workflow-steps`),
  getFileProgress: fileId => translationStatusApi.getFileProgress(projectId, fileId),
  addTask: data => tasksApi.addTask(projectId, data),
}
