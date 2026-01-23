const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prevent Metro from watching parent directories and other apps
config.watchFolders = [__dirname];
config.resolver.blockList = /(.*\.next\/.*|.*\/apps\/(web|server)\/.*)/;

module.exports = config;
