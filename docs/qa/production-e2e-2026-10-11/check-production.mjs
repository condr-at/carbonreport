// Read-only production checks for this run's synthetic project. The only writes
// are normal login sessions. Credentials stay in a private file outside the repo.
// node check-production.mjs /absolute/private-credentials.json [--outsider]
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const root = new URL('./', import.meta.url)
const base = 'https://carbonreport.app'
const projectId = 'c56321c8-4d0b-4eb0-bbc7-819fc29054aa'
const reportId = 'd59b54f9-dfb4-454b-9101-ac47ddb3ac3c'
const project = `/projects/${projectId}`
const endpoint = `/api${project}/reports/${reportId}/supplier-package`
const credentials = JSON.parse(await fs.readFile(process.argv[2], 'utf8'))
const checks = []
async function login(account) {
  const response = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email:account.email,password:account.password}),
  })
  assert.equal(response.status, 200, 'Test-account login must succeed')
  return response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ')
}
async function check(path, cookie, expectedStatus, label) {
  const response = await fetch(base + path, {headers: cookie ? {Cookie:cookie} : {}, redirect:'manual'})
  const body = await response.text()
  checks.push({label,status:response.status,expectedStatus,pass:response.status===expectedStatus})
  assert.equal(response.status, expectedStatus, label)
  return body
}
try {
  const owner = await login(credentials.owner)
  const saved = JSON.parse(await check(endpoint, owner, 200, 'owner reads saved package'))
  const expected = JSON.parse(await fs.readFile(new URL('expected-package.json',root),'utf8'))
  assert.equal(saved.datasetVersion, expected.datasetVersion)
  for (const [key,value] of Object.entries(expected.values)) assert.equal(saved.validation.values[key],value,key)
  await fs.writeFile(new URL('saved-package.json',root),JSON.stringify(saved,null,2)+'\n')
  await check(endpoint, '', 401, 'anonymous package denied')
  await check(endpoint+'?format=zip', owner, 400, 'ZIP requires saved version')
  await check(endpoint+'?format=zip&expectedDatasetVersion=0', owner, 409, 'stale ZIP version denied')
  if (process.argv.includes('--outsider')) {
    const outsider = await login(credentials.outsider)
    await check(endpoint, outsider, 403, 'outsider package JSON denied')
    await check(endpoint+'?format=zip&expectedDatasetVersion=7', outsider, 403, 'outsider ZIP denied')
    for (const path of [project,project+'/dataset',project+`/reports/${reportId}`]) {
      const response = await fetch(base+path,{headers:{Cookie:outsider}})
      const html = await response.text()
      // Streaming Next responses may have committed a 200 before notFound().
      const leaked = ['QA Synthetic Steel 20261011-115452','Example steel goods','Alex QA Preparer'].some(value=>html.includes(value))
      checks.push({label:'outsider SSR '+path,status:response.status,leaked,pass:!leaked})
      assert.equal(leaked,false,'Outsider HTML must not contain project data')
    }
  }
} finally {
  const filename = process.argv.includes('--outsider') ? 'production-access-checks.json' : 'production-owner-checks.json'
  const result = {checkedAt:new Date().toISOString(),base,projectId,reportId,checks}
  await fs.writeFile(new URL(filename,root),JSON.stringify(result,null,2)+'\n')
  console.log(JSON.stringify(result,null,2))
}
