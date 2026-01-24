const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Exclusion list to ignore temporary turbo directories
config.resolver.blacklistRE = /node_modules\/.*_tmp_.*/;

module.exports = config;

// Block Next.js build directories in monorepo
config.resolver.blockList = /\.next/;

module.exports = config;
