const fs = require('fs')

function parseReportTypes(path) {
  const rows = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/)
  rows.shift() // remove header
  return rows
    .map((line) => line.split(';')[0].trim())
    .filter(Boolean)
    .filter((name) => !name.startsWith('hint_for_') && name !== 'implemented_in_database')
}

const corporate = [...new Set(parseReportTypes('docs/data points guide/datapoints-reports-CORPORATE-2026.csv'))]
const product = [...new Set(parseReportTypes('docs/data points guide/datapoints-reports-PRODUCT-2026.csv'))]

console.log('corporate report types', corporate.length)
console.log(corporate.join(', '))
console.log('product report types', product.length)
console.log(product.join(', '))
