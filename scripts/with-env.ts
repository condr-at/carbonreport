import { config as loadEnv } from 'dotenv'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const [, , envFileArg, ...commandParts] = process.argv

if (!envFileArg || commandParts.length === 0) {
  console.error('Usage: tsx scripts/with-env.ts <env-file> <command> [...args]')
  process.exit(1)
}

const envFilePath = path.resolve(process.cwd(), envFileArg)

if (!fs.existsSync(envFilePath)) {
  console.error(`Env file not found: ${envFilePath}`)
  process.exit(1)
}

const result = loadEnv({
  path: envFilePath,
  override: true,
})

if (result.error) {
  console.error(`Failed to load env file: ${envFilePath}`)
  console.error(result.error)
  process.exit(1)
}

const [command, ...args] = commandParts

const child = spawn(command, args, {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})

