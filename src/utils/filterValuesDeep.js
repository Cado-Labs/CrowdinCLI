const filterValuesDeep = (obj, filter) => {
  const result = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (value === filter) return

    if (typeof value === 'object') {
      result[key] = filterValuesDeep(value)
    } else {
      result[key] = value
    }
  })

  return result
}

module.exports = filterValuesDeep
