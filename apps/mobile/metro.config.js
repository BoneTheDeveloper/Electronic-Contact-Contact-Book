const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Block Next.js build directories in monorepo
config.resolver.blockList = [
  /\.next/,
  /node_modules\/.*_tmp_.*/,
];

// Watch folders for monorepo - only watch workspace packages
config.watchFolders.push(
  path.resolve(__dirname, '../../packages/shared-ui'),
);

// Reduce file watching overhead
config.maxWorkers = 2;

module.exports = config;
