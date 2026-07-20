const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable support for `@/` path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname),
  '@/*': path.resolve(__dirname),
};

module.exports = config;
