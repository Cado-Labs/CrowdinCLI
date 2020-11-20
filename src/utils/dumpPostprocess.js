// **
// *
// * wrap strings which look as:
// * key: foo *Bar
// * in single brackets, and return string what look as:
// * key: 'foo *Bar'
// * this is bug in Crowdin, and without this crowdin remove string =(
// *

function replaceOther (file) {
  return file.replace(
    /^\s*\w+:(?!\n)\s(?!'|")(.*\*\w+.*)(?!'|")$/gm,
    (a, b) => a.replace(b, `'${b}'`),
  )
}

// **
// * Wrapping strings which look as:
// * key: foo\nbar
// * in double brackets, and return string look as:
// * key: "foo\nbar"
// *

function wrapNewLinesInQuotes (file) {
  return file.replace(
    /^\s*\w+:(?!\n)\s(?!"|')(.*\\n.*)(?!"|')$/gm,
    (a, b) => a.replace(b, `"${b.replace('"', '\\"')}"`),
  )
}

const replaceres = [
  replaceOther,
  wrapNewLinesInQuotes,
]

module.exports = file => replaceres.reduce((acc, replacer) => replacer(acc), file)
