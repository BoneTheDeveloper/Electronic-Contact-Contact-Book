const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const workspacePath = path.join(__dirname, '..', 'pnpm-workspace.yaml');
const workspaceBackupPath = path.join(__dirname, '..', 'pnpm-workspace.yaml.backup');

// Backup and modify workspace to exclude mobile app
console.log('🔧 Configuring workspace for Vercel deployment...');

const workspaceContent = fs.readFileSync(workspacePath, 'utf8');
fs.writeFileSync(workspaceBackupPath, workspaceContent);

// Write workspace without mobile app
const minimalWorkspace = `packages:
  - packages/shared-types
  - packages/shared-ui
`;
fs.writeFileSync(workspacePath, minimalWorkspace);

try {
  // Install only web app dependencies
  console.log('📦 Installing dependencies...');
  execSync('pnpm install --no-frozen-lockfile --ignore-scripts --no-strict-peer-dependencies', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} finally {
  // Restore original workspace
  fs.writeFileSync(workspacePath, fs.readFileSync(workspaceBackupPath, 'utf8'));
  fs.unlinkSync(workspaceBackupPath);
  console.log('✅ Workspace restored');
}
