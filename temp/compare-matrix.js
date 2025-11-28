const fs = require('fs')

const dataset = JSON.parse(fs.readFileSync('temp/dataset-field-ids.json', 'utf8'))
const corp = JSON.parse(fs.readFileSync('temp/corp-matrix-header.json', 'utf8')).slice(3)
const product = JSON.parse(fs.readFileSync('temp/product-matrix-header.json', 'utf8')).slice(3)
const matrix = new Set([...corp, ...product])
const datasetSet = new Set(dataset)
const missing = [...matrix].filter((id) => id && !datasetSet.has(id)).sort()
const extra = [...datasetSet].filter((id) => id && !matrix.has(id)).sort()

console.log('missing fields count', missing.length)
console.log('extra dataset fields', extra.length)

fs.writeFileSync('temp/matrix-missing-fields.json', JSON.stringify(missing, null, 2))
fs.writeFileSync('temp/dataset-extra-fields.json', JSON.stringify(extra, null, 2))
