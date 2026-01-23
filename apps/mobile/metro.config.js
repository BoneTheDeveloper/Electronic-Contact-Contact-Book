const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Block Next.js build directories in monorepo
config.resolver.blockList = /\.next/;

module.exports = config;
