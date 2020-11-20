const https = require('https')
const fs = require('fs')

module.exports = (url, path) => new Promise((resolve, reject) => {
  const file = fs.createWriteStream(path)
  https.get(url, res => {
    res.pipe(file)
    res.on('end', () => resolve())
    res.on('error', e => reject(e))
  })
})
