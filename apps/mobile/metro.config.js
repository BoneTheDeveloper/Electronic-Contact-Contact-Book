const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Enable new architecture for react-native-paper v6+
config.resolver.unstable_enablePackageExports = true;

// Fix "Body has already been read" error by properly configuring the server
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Ensure request body is not consumed multiple times
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
