#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

console.log('🔍 New Architecture Compatibility Audit\n');
console.log('='.repeat(60));

const libraries = [
  { name: 'expo', pkg: dependencies['expo'] },
  { name: 'react-native', pkg: dependencies['react-native'] },
  { name: '@react-navigation/native', pkg: dependencies['@react-navigation/native'] },
  { name: '@react-navigation/native-stack', pkg: dependencies['@react-navigation/native-stack'] },
  { name: '@react-navigation/bottom-tabs', pkg: dependencies['@react-navigation/bottom-tabs'] },
  { name: 'react-native-paper', pkg: dependencies['react-native-paper'] },
  { name: 'zustand', pkg: dependencies['zustand'] },
  { name: '@react-native-async-storage/async-storage', pkg: dependencies['@react-native-async-storage/async-storage'] },
  { name: 'react-native-safe-area-context', pkg: dependencies['react-native-safe-area-context'] },
  { name: 'react-native-screens', pkg: dependencies['react-native-screens'] },
  { name: 'react-native-svg', pkg: dependencies['react-native-svg'] },
  { name: 'expo-dev-client', pkg: dependencies['expo-dev-client'] },
  { name: 'expo-status-bar', pkg: dependencies['expo-status-bar'] },
];

libraries.forEach(({ name, pkg }) => {
  const pkgPath = path.join(__dirname, '../node_modules', name, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    console.log(`❌ ${name}: ${pkg} (NOT FOUND)`);
    return;
  }

  const libPackageJson = require(pkgPath);
  const codegenConfig = libPackageJson.codegenConfig;
  const hasCodegenConfig = !!codegenConfig;

  const status = hasCodegenConfig ? '✅' : '⚪';
  const support = hasCodegenConfig ? 'Native Support' : 'JS/Compatible';

  console.log(`${status} ${name}`);
  console.log(`   Version: ${pkg}`);
  console.log(`   Support: ${support}`);
  if (codegenConfig) {
    console.log(`   CodeGen: ${JSON.stringify(codegenConfig)}`);
  }
  console.log('');
});

console.log('='.repeat(60));
console.log('\nLegend:');
console.log('✅ = Native New Architecture support (TurboModule/Fabric)');
console.log('⚪ = JavaScript library or compatibility layer');
console.log('❌ = Not found or incompatible');
