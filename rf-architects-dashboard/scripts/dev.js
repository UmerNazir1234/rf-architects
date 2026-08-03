const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const nextBin = path.join(projectRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');

function killExistingNextDev() {
  if (process.platform !== 'win32') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const powershell = spawn(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'rf-architects-dashboard' -and ($_.CommandLine -match 'next' -or $_.CommandLine -match 'start-server') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }",
      ],
      {
        stdio: 'ignore',
      }
    );

    powershell.on('close', () => resolve());
    powershell.on('error', () => resolve());
  });
}

async function main() {
  await killExistingNextDev();

  const port = process.env.PORT || '3001';

  const child = spawn(
    process.platform === 'win32' ? 'cmd.exe' : nextBin,
    process.platform === 'win32'
      ? ['/c', nextBin, 'dev', '--port', port]
      : ['dev', '--port', port],
    {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: false,
    }
  );

  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
