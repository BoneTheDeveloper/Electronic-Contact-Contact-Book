/**
 * Simple Test Script for Development Utilities
 * Run with: node test-dev-utilities.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════╗');
console.log('║  Dev Utility Tests - Phase 04: Testing       ║');
console.log('╚════════════════════════════════════════════════╝\n');

const devOnlyPath = path.join(__dirname, 'src', 'utils', 'devOnly');

console.log('=== File Structure Verification ===\n');

const requiredFiles = [
  'verifyNewArchitecture.ts',
  'screenChecklist.ts',
  'performanceTest.ts',
  'index.ts',
  'TEST_REPORT_TEMPLATE.md',
  'README.md',
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(devOnlyPath, file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log(`\n${allFilesExist ? '✅ PASS' : '❌ FAIL'}: All required files exist\n`);

console.log('=== TypeScript Compilation ===\n');

const { execSync } = require('child_process');

try {
  console.log('Running: pnpm --filter @school-management/mobile typecheck');
  execSync('pnpm --filter @school-management/mobile typecheck', {
    cwd: path.join(__dirname, '..', '..'),
    stdio: 'inherit'
  });
  console.log('\n✅ PASS: TypeScript compilation successful\n');
} catch (error) {
  console.log('\n❌ FAIL: TypeScript compilation failed\n');
  process.exit(1);
}

console.log('=== Screen Checklist Validation ===\n');

// Read and parse screenChecklist.ts to verify screen count
const screenChecklistPath = path.join(devOnlyPath, 'screenChecklist.ts');
const screenChecklistContent = fs.readFileSync(screenChecklistPath, 'utf-8');

// Count screen entries in SCREEN_CHECKLIST array
const screenEntries = screenChecklistContent.match(/path:\s*['"][\w\/\-]+['"]/g);
const screenCount = screenEntries ? screenEntries.length : 0;

console.log(`Screens found: ${screenCount}`);
console.log(`Expected: 37`);
console.log(`${screenCount === 37 ? '✅ PASS' : '❌ FAIL'}: Screen count validation\n`);

console.log('=== Critical Screen Validation ===\n');

// Count critical screens
const criticalEntries = screenChecklistContent.match(/critical: true/g);
const criticalCount = criticalEntries ? criticalEntries.length : 0;

console.log(`Critical screens: ${criticalCount}`);
console.log(`Expected: 28-30 (approximate)`);
console.log(`${criticalCount > 0 ? '✅ PASS' : '❌ FAIL'}: Critical screens defined\n`);

console.log('=== Performance Test Validation ===\n');

const performanceTestPath = path.join(devOnlyPath, 'performanceTest.ts');
const performanceTestContent = fs.readFileSync(performanceTestPath, 'utf-8');

const requiredFunctions = [
  'measurePerformance',
  'measureNavigation',
  'measureScrollPerformance',
  'measureMemoryUsage',
  'runPerformanceTests',
  'measureAppStartup',
];

let allFunctionsExist = true;

requiredFunctions.forEach(func => {
  const exists = performanceTestContent.includes(`export const ${func}`);
  console.log(`${exists ? '✅' : '❌'} ${func}`);
  if (!exists) allFunctionsExist = false;
});

console.log(`\n${allFunctionsExist ? '✅ PASS' : '❌ FAIL'}: All performance functions exist\n`);

console.log('=== Documentation Validation ===\n');

const readmePath = path.join(devOnlyPath, 'README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf-8');

const docSections = [
  'Quick Start',
  'API Reference',
  'Performance Benchmarks',
  'Test Execution Steps',
];

let allSectionsExist = true;

docSections.forEach(section => {
  const exists = readmeContent.includes(section);
  console.log(`${exists ? '✅' : '❌'} ${section}`);
  if (!exists) allSectionsExist = false;
});

console.log(`\n${allSectionsExist ? '✅ PASS' : '❌ FAIL'}: All documentation sections exist\n`);

console.log('=== Test Report Template Validation ===\n');

const reportTemplatePath = path.join(devOnlyPath, 'TEST_REPORT_TEMPLATE.md');
const reportContent = fs.readFileSync(reportTemplatePath, 'utf-8');

const reportSections = [
  'Environment Information',
  'Test Summary',
  'New Architecture Verification',
  'Screen Test Results',
  'Performance Benchmarks',
];

let allReportSectionsExist = true;

reportSections.forEach(section => {
  const exists = reportContent.includes(section);
  console.log(`${exists ? '✅' : '❌'} ${section}`);
  if (!exists) allReportSectionsExist = false;
});

console.log(`\n${allReportSectionsExist ? '✅ PASS' : '❌ FAIL'}: All report sections exist\n`);

console.log('╔════════════════════════════════════════════════╗');
console.log('║  Test Summary                                   ║');
console.log('╚════════════════════════════════════════════════╝\n');

const allPassed = allFilesExist && screenCount === 37 && criticalCount > 0 && allFunctionsExist && allSectionsExist && allReportSectionsExist;

if (allPassed) {
  console.log('✅ ALL TESTS PASSED\n');
  console.log('Testing infrastructure is ready!');
  console.log('Next steps:');
  console.log('1. Build development versions: npx expo prebuild');
  console.log('2. Install on test devices');
  console.log('3. Run manual tests using the checklist');
  console.log('4. Document results in TEST_REPORT_TEMPLATE.md\n');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED\n');
  console.log('Please review the failures above.\n');
  process.exit(1);
}
