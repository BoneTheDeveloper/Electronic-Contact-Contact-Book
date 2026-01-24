#!/usr/bin/env node
/**
 * Supabase Type Auto-Generation Watcher
 *
 * Watches for schema changes in migration files and auto-regenerates TypeScript types.
 * Windows-compatible with polling for better file system detection.
 *
 * Usage: npm run watch:types
 */

const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
  // Migration files to watch
  watchPaths: [
    path.join(__dirname, '../supabase/migrations'),
    path.join(__dirname, '../supabase/db')
  ],
  // Output file for generated types
  outputFile: path.join(__dirname, '../apps/web/types/supabase.ts'),
  // Debounce delay (ms) to prevent excessive regeneration
  debounceMs: 2000,
  // Polling interval (ms) - required for Windows
  pollInterval: 1000,
  // Supabase CLI command - use project ID for cloud generation (no Docker required)
  command: 'npx',
  args: ['supabase', 'gen', 'types', 'typescript', '--project-id', 'lshmmoenfeodsrthsevf', '--schema', 'public'],
  // Verbose output
  verbose: true
};

// State
let debounceTimer = null;
let isRegenerating = false;
let watcherProcess = null;

/**
 * Log with timestamp
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '[INFO]',
    success: '[SUCCESS]',
    error: '[ERROR]',
    warn: '[WARN]'
  }[type] || '[INFO]';

  console.log(`${timestamp} ${prefix} ${message}`);
}

/**
 * Regenerate Supabase types
 */
function regenerateTypes(filePath = null) {
  if (isRegenerating) {
    log('Already regenerating, skipping...', 'warn');
    return;
  }

  isRegenerating = true;

  if (filePath) {
    log(`Schema change detected: ${path.basename(filePath)}`);
  } else {
    log('Regenerating types...');
  }

  const startTime = Date.now();

  exec(`${CONFIG.command} ${CONFIG.args.join(' ')} > "${CONFIG.outputFile}"`, {
    cwd: path.join(__dirname, '..'),
    windowsHide: true
  }, (error, stdout, stderr) => {
    isRegenerating = false;

    if (error) {
      log(`Type generation failed: ${error.message}`, 'error');
      if (stderr) {
        log(`STDERR: ${stderr}`, 'error');
      }
      return;
    }

    const elapsed = Date.now() - startTime;
    log(`Types regenerated successfully (${elapsed}ms)`, 'success');

    // Verify output file exists
    if (!fs.existsSync(CONFIG.outputFile)) {
      log(`Warning: Output file not found at ${CONFIG.outputFile}`, 'warn');
      return;
    }

    // Check file size
    const stats = fs.statSync(CONFIG.outputFile);
    log(`Generated file size: ${(stats.size / 1024).toFixed(2)} KB`);
  });
}

/**
 * Simple file watcher using polling (Windows-compatible)
 */
function startPollingWatcher() {
  log('Starting polling watcher for migration files...');
  log(`Watching: ${CONFIG.watchPaths.join(', ')}`);
  log(`Output: ${CONFIG.outputFile}`);
  log('Press Ctrl+C to stop');

  // Track file modification times
  const fileStates = new Map();

  // Function to scan for files
  const scanFiles = () => {
    for (const watchPath of CONFIG.watchPaths) {
      if (!fs.existsSync(watchPath)) {
        log(`Path does not exist: ${watchPath}`, 'warn');
        continue;
      }

      const files = fs.readdirSync(watchPath)
        .filter(f => f.endsWith('.sql'))
        .map(f => path.join(watchPath, f));

      for (const file of files) {
        try {
          const stats = fs.statSync(file);
          const mtime = stats.mtimeMs;
          const previousMtime = fileStates.get(file);

          if (previousMtime !== undefined && mtime !== previousMtime) {
            // File changed
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              regenerateTypes(file);
            }, CONFIG.debounceMs);
          }

          fileStates.set(file, mtime);
        } catch (err) {
          log(`Error reading file ${file}: ${err.message}`, 'error');
        }
      }
    }
  };

  // Initial scan
  scanFiles();

  // Poll at interval
  setInterval(scanFiles, CONFIG.pollInterval);
}

/**
 * Try to use chokidar if available, otherwise fall back to polling
 */
function startWatcher() {
  // Check if chokidar is available
  try {
    require.resolve('chokidar');
    log('Using chokidar for file watching...');

    const chokidar = require('chokidar');

    // Initialize watcher with migration files
    const watcher = chokidar.watch(CONFIG.watchPaths.map(p => `${p}/*.sql`), {
      persistent: true,
      ignoreInitial: true,
      usePolling: true,
      interval: CONFIG.pollInterval,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      }
    });

    watcher
      .on('add', filePath => {
        log(`New file: ${path.basename(filePath)}`);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => regenerateTypes(filePath), CONFIG.debounceMs);
      })
      .on('change', filePath => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => regenerateTypes(filePath), CONFIG.debounceMs);
      })
      .on('error', error => log(`Watcher error: ${error}`, 'error'));

    log('Watcher started with chokidar');

  } catch (e) {
    // Chokidar not available, use polling fallback
    log('Chokidar not found, using polling fallback (install chokidar for better performance)', 'warn');
    startPollingWatcher();
  }
}

/**
 * Cleanup on exit
 */
function cleanup() {
  log('Stopping watcher...');

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  if (watcherProcess) {
    watcherProcess.kill();
  }

  process.exit(0);
}

// Handle signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Start watcher
log('=== Supabase Type Auto-Generation Watcher ===');
log('');

// Check if output directory exists
const outputDir = path.dirname(CONFIG.outputFile);
if (!fs.existsSync(outputDir)) {
  log(`Creating output directory: ${outputDir}`);
  fs.mkdirSync(outputDir, { recursive: true });
}

// Initial regeneration
regenerateTypes();

// Start watching after a short delay
setTimeout(() => {
  startWatcher();
}, 1000);
