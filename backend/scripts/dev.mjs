import { spawn } from 'node:child_process'
const children = ['backend', 'frontend'].map(name => spawn(process.execPath, [process.env.npm_execpath, 'run', 'dev', '--workspace', name], { stdio: 'inherit' }))
for (const child of children) child.on('exit', code => { for (const other of children) other.kill(); process.exit(code ?? 0) })
process.on('SIGINT', () => children.forEach(child => child.kill()))
