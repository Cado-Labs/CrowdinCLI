const config = require('../config')

module.exports = () => {
  const { contributors } = config
  const assignees = contributors ? contributors.replace(/\s+/g, '').split(',') : []
  return assignees.reduce((acc, id) => ([...acc, { id: Number(id) }]), [])
}
