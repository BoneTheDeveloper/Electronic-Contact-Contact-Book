const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const workspacePath = path.join(__dirname, '..', 'pnpm-workspace.yaml');
const workspaceBackupPath = path.join(__dirname, '..', 'pnpm-workspace.yaml.backup');

// Backup and modify workspace to exclude mobile app
console.log('🔧 Configuring workspace for Vercel deployment (excluding mobile)...');

const workspaceContent = fs.readFileSync(workspacePath, 'utf8');
fs.writeFileSync(workspaceBackupPath, workspaceContent);

// Write workspace without mobile app - only web and shared packages
const minimalWorkspace = `packages:
  - packages/shared-types
  - packages/shared-ui
  - apps/web
`;
fs.writeFileSync(workspacePath, minimalWorkspace);

try {
  // Install only for the filtered workspace
  console.log('📦 Installing dependencies...');
  execSync('pnpm install --frozen-lockfile', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} finally {
  // Restore original workspace
  fs.writeFileSync(workspacePath, fs.readFileSync(workspaceBackupPath, 'utf8'));
  fs.unlinkSync(workspaceBackupPath);
  console.log('✅ Workspace restored');
}
