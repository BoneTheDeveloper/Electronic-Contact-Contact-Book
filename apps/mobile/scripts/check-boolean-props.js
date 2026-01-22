#!/usr/bin/env node

/**
 * Standalone script to check for string-based boolean props in React Native JSX
 * Usage: node scripts/check-boolean-props.js
 *
 * This script scans all TSX/JSX files for patterns like:
 * - prop="true"
 * - prop='false'
 * Which should be prop={true} or prop={false}
 */

const fs = require('fs');
const path = require('path');

const BOOLEAN_PROPS = [
  'visible', 'animated', 'transparent', 'modal',
  'editable', 'secureTextEntry', 'autoCapitalize', 'autoCorrect',
  'scrollEnabled', 'bounces', 'pagingEnabled',
  'disabled', 'active', 'selected',
  'value', 'enabled', 'animating', 'hidesWhenStopped',
  'showsVerticalScrollIndicator', 'showsHorizontalScrollIndicator',
  'refreshing', 'hidden', 'show', 'hide',
];

function findJsxFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        findJsxFiles(fullPath, files);
      }
    } else if (entry.name.match(/\.(tsx|jsx)$/)) {
      files.push(fullPath);
    }
  }
  return files;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, index) => {
    // Check for prop="true" or prop='true'
    const pattern = new RegExp(
      `(${BOOLEAN_PROPS.join('|')})=["'](true|false)["']`,
      'g'
    );

    let match;
    while ((match = pattern.exec(line)) !== null) {
      violations.push({
        line: index + 1,
        prop: match[1],
        value: match[2],
        text: line.trim(),
      });
    }
  });

  return violations;
}

function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findJsxFiles(srcDir);
  let totalViolations = 0;

  console.log('🔍 Checking for string-based boolean props...\n');

  for (const file of files) {
    const violations = checkFile(file);
    if (violations.length > 0) {
      console.log(`❌ ${path.relative(srcDir, file)}:`);
      violations.forEach(v => {
        console.log(`   Line ${v.line}: ${v.prop}="${v.value}"`);
        console.log(`   ${v.text}`);
        console.log(`   Fix: Change to ${v.prop}={${v.value}}\n`);
      });
      totalViolations += violations.length;
    }
  }

  if (totalViolations === 0) {
    console.log('✅ No string-based boolean props found!');
    console.log('All boolean props use proper JavaScript expressions.\n');
    process.exit(0);
  } else {
    console.log(`❌ Found ${totalViolations} string-based boolean prop(s)!\n`);
    console.log('String-based boolean props can cause React Native crashes.');
    console.log('Please fix them before committing.\n');
    process.exit(1);
  }
}

main();
