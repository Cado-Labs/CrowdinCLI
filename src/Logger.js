const readline = require('readline')
const abort = require('./utils/abort')
const params = require('./params')

const symbols = ['◐', '◓', '◑', '◒']

class Logger {
  constructor (message) {
    this.message = message
    this.symbolIndex = 0
    if (!params.silent) {
      this.interval = setInterval(this._update, 150)
    }
    this._log()
  }

  _update = () => {
    readline.clearLine(process.stdout)
    this.symbolIndex += 1
    if (this.symbolIndex >= symbols.length) this.symbolIndex = 0
    this._log()
  }

  success = () => {
    if (this.interval) clearInterval(this.interval)
    if (!params.silent) readline.clearLine(process.stdout)
    if (params.silent) process.stdout.write('\n')
    this._log(true)
    process.stdout.write('\n')
  }

  error = (...args) => {
    if (this.interval) clearInterval(this.interval)
    if (!params.silent) readline.clearLine(process.stdout)
    process.stdout.write('\n')
    abort(`❌   ${this.message} FAILED\n`, ...args)
  }

  _log = succeeded => {
    if (!params.silent) readline.cursorTo(process.stdout, 0)
    const symbol = params.silent ? '*' : symbols[this.symbolIndex]
    const successSymbol = params.silent ? '[DONE]' : '✔'
    process.stdout.write(`${succeeded ? successSymbol : symbol}   ${this.message}`)
  }
}

module.exports = Logger
