import { spawn } from 'node:child_process'

const task = process.argv[2]
if (!['start', 'serve'].includes(task)) throw new Error('Expected start or serve')
const children = ['air-and-water-client', 'air-and-water-server'].map(workspace =>
  spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', task, `--workspace=${workspace}`], { stdio: 'inherit', shell: process.platform === 'win32' }),
)
let stopping = false
function stop(code) {
  if (stopping) return
  stopping = true
  process.exitCode = code
  for (const child of children) child.kill('SIGTERM')
}
for (const child of children) {
  child.on('error', error => { console.error(error); stop(1) })
  child.on('exit', code => stop(code ?? 0))
}
process.on('SIGINT', () => stop(130))
process.on('SIGTERM', () => stop(143))
