const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\x1b[36m%s\x1b[0m', '🚀 Starting Bus Reservation System...');
console.log('\x1b[33m%s\x1b[0m', '📦 Backend: http://localhost:5000');
console.log('\x1b[33m%s\x1b[0m', '🌐 Frontend: http://localhost:3000');
console.log('\x1b[90m%s\x1b[0m', 'Press Ctrl+C to stop both\n');

const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'pipe',
  shell: false
});

const frontend = spawn('npx', ['live-server', 'frontend', '--port=3000', '--no-browser'], {
  cwd: __dirname,
  stdio: 'pipe',
  shell: false
});

backend.stdout.on('data', (data) => {
  console.log('\x1b[34m%s\x1b[0m', `[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.log('\x1b[31m%s\x1b[0m', `[Backend Error] ${data.toString().trim()}`);
});

frontend.stdout.on('data', (data) => {
  console.log('\x1b[32m%s\x1b[0m', `[Frontend] ${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.log('\x1b[31m%s\x1b[0m', `[Frontend Error] ${data.toString().trim()}`);
});

process.on('SIGINT', () => {
  console.log('\n\x1b[36m%s\x1b[0m', '\n🛑 Stopping servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  setTimeout(() => process.exit(0), 1000);
});

backend.on('exit', (code) => {
  console.log('\x1b[33m%s\x1b[0m', `📦 Backend exited with code ${code}`);
});

frontend.on('exit', (code) => {
  console.log('\x1b[33m%s\x1b[0m', `🌐 Frontend exited with code ${code}`);
});