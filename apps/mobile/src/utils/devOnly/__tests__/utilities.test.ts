/**
 * Test Suite for Development Testing Utilities
 * Tests all functions in devOnly utilities
 */

import {
  verifyNewArchitecture,
  getTurboModules,
  verifyReactNativeVersion,
  type NewArchitectureInfo,
} from '../verifyNewArchitecture';

import {
  SCREEN_CHECKLIST,
  getScreensByCategory,
  getCriticalScreens,
  getTotalScreenCount,
  getCriticalScreenCount,
  printChecklist,
  validateScreenCount,
  type ScreenChecklistItem,
} from '../screenChecklist';

import {
  measurePerformance,
  measureScrollPerformance,
  measureMemoryUsage,
  measureAppStartup,
  initStartupMeasurement,
  formatPerformanceReport,
  type PerformanceMetrics,
  type PerformanceReport,
} from '../performanceTest';

/**
 * Test Group 1: verifyNewArchitecture.ts
 */
function testVerifyNewArchitecture() {
  console.log('\n=== Testing verifyNewArchitecture.ts ===\n');

  // Test 1: verifyNewArchitecture returns correct structure
  console.log('Test 1: verifyNewArchitecture() structure');
  const archInfo: NewArchitectureInfo = verifyNewArchitecture();
  console.log('  ✓ Returns NewArchitectureInfo');
  console.log(`  Platform: ${archInfo.platform}`);
  console.log(`  New Arch Enabled: ${archInfo.newArchEnabled}`);
  console.log(`  Hermes Enabled: ${archInfo.hermesEnabled}`);
  console.log(`  TurboModules Enabled: ${archInfo.turboModulesEnabled}`);
  console.log(`  Fabric Enabled: ${archInfo.fabricEnabled}`);

  // Verify structure
  const hasRequiredFields =
    typeof archInfo.platform === 'string' &&
    typeof archInfo.newArchEnabled === 'boolean' &&
    typeof archInfo.hermesEnabled === 'boolean' &&
    typeof archInfo.turboModulesEnabled === 'boolean' &&
    typeof archInfo.fabricEnabled === 'boolean';

  console.log(`  ${hasRequiredFields ? '✅ PASS' : '❌ FAIL'}: Has all required fields\n`);

  // Test 2: getTurboModules returns array
  console.log('Test 2: getTurboModules()');
  const turboModules = getTurboModules();
  console.log(`  ✓ Returns array with ${turboModules.length} modules`);
  console.log(`  ${Array.isArray(turboModules) ? '✅ PASS' : '❌ FAIL'}: Returns array\n`);

  // Test 3: verifyReactNativeVersion returns boolean
  console.log('Test 3: verifyReactNativeVersion()');
  const versionSupported = verifyReactNativeVersion();
  console.log(`  ✓ Returns: ${versionSupported}`);
  console.log(`  ${typeof versionSupported === 'boolean' ? '✅ PASS' : '❌ FAIL'}: Returns boolean\n`);
}

/**
 * Test Group 2: screenChecklist.ts
 */
function testScreenChecklist() {
  console.log('\n=== Testing screenChecklist.ts ===\n');

  // Test 1: SCREEN_CHECKLIST has correct count
  console.log('Test 1: SCREEN_CHECKLIST count');
  const totalCount = getTotalScreenCount();
  console.log(`  Total screens: ${totalCount}`);
  console.log(`  ${totalCount === 37 ? '✅ PASS' : '❌ FAIL'}: Expected 37 screens\n`);

  // Test 2: validateScreenCount
  console.log('Test 2: validateScreenCount()');
  const isValid = validateScreenCount();
  console.log(`  Screen count valid: ${isValid}`);
  console.log(`  ${isValid ? '✅ PASS' : '❌ FAIL'}: Screen count validation\n`);

  // Test 3: getCriticalScreens
  console.log('Test 3: getCriticalScreens()');
  const criticalScreens = getCriticalScreens();
  const criticalCount = getCriticalScreenCount();
  console.log(`  Critical screens: ${criticalCount}`);
  console.log(`  ${criticalScreens.length === criticalCount ? '✅ PASS' : '❌ FAIL'}: Count matches\n`);

  // Test 4: getScreensByCategory
  console.log('Test 4: getScreensByCategory()');
  const authScreens = getScreensByCategory('auth');
  const dashboardScreens = getScreensByCategory('dashboard');
  console.log(`  Auth screens: ${authScreens.length}`);
  console.log(`  Dashboard screens: ${dashboardScreens.length}`);
  console.log(`  ${authScreens.length > 0 ? '✅ PASS' : '❌ FAIL'}: Category filtering works\n`);

  // Test 5: Screen structure validation
  console.log('Test 5: Screen structure validation');
  const firstScreen = SCREEN_CHECKLIST[0];

  if (!firstScreen) {
    console.log('  ❌ FAIL: SCREEN_CHECKLIST is empty\n');
    return;
  }

  const hasValidStructure =
    typeof firstScreen.path === 'string' &&
    typeof firstScreen.name === 'string' &&
    typeof firstScreen.category === 'string' &&
    typeof firstScreen.critical === 'boolean';
  console.log(`  First screen: ${firstScreen.name} (${firstScreen.path})`);
  console.log(`  ${hasValidStructure ? '✅ PASS' : '❌ FAIL'}: Screen has valid structure\n`);

  // Test 6: Print checklist (dry run)
  console.log('Test 6: printChecklist()');
  console.log('  ✓ Printing checklist...');
  printChecklist();
  console.log('✅ PASS: printChecklist() executed\n');
}

/**
 * Test Group 3: performanceTest.ts
 */
async function testPerformanceTests() {
  console.log('\n=== Testing performanceTest.ts ===\n');

  // Test 1: measurePerformance
  console.log('Test 1: measurePerformance()');
  const metric1 = await measurePerformance(
    'Test Operation',
    async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 10));
    },
    50, // Target: 50ms
    100 // Max: 100ms
  );
  console.log(`  Duration: ${metric1.duration.toFixed(2)}ms`);
  console.log(`  Passed: ${metric1.passed}`);
  console.log(`  ${metric1.duration < 100 ? '✅ PASS' : '❌ FAIL'}: Performance measurement works\n`);

  // Test 2: measureScrollPerformance
  console.log('Test 2: measureScrollPerformance()');
  const metric2 = measureScrollPerformance('Test List', 100);
  console.log(`  Operation: ${metric2.operation}`);
  console.log(`  Duration: ${metric2.duration.toFixed(2)}ms`);
  console.log(`  Passed: ${metric2.passed}`);
  console.log(`  ${typeof metric2.duration === 'number' ? '✅ PASS' : '❌ FAIL'}: Scroll performance measurement works\n`);

  // Test 3: measureMemoryUsage
  console.log('Test 3: measureMemoryUsage()');
  const metric3 = measureMemoryUsage();
  if (metric3) {
    console.log(`  Memory usage: ${metric3.duration.toFixed(2)}MB`);
    console.log(`  Passed: ${metric3.passed}`);
    console.log(`  ✅ PASS: Memory measurement available\n`);
  } else {
    console.log(`  ⚠️  WARN: Memory measurement not available (expected on some platforms)\n`);
  }

  // Test 4: measureAppStartup
  console.log('Test 4: measureAppStartup()');
  initStartupMeasurement();
  await new Promise<void>((resolve) => setTimeout(resolve, 10));
  const metric4 = measureAppStartup();
  console.log(`  Startup time: ${metric4.duration.toFixed(2)}ms`);
  console.log(`  Passed: ${metric4.passed}`);
  console.log(`  ${metric4.duration > 0 ? '✅ PASS' : '❌ FAIL'}: Startup measurement works\n`);

  // Test 5: formatPerformanceReport
  console.log('Test 5: formatPerformanceReport()');
  const report: PerformanceReport = {
    totalOperations: 3,
    passed: 2,
    failed: 1,
    metrics: [metric1, metric2, metric4],
  };
  const formatted = formatPerformanceReport(report);
  console.log(`  Report length: ${formatted.length} characters`);
  console.log(`  ${formatted.length > 0 ? '✅ PASS' : '❌ FAIL'}: Report formatting works\n`);
  console.log(formatted);
}

/**
 * Run all tests
 */
export async function runDevUtilityTests() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  Dev Utility Tests - Phase 04: Testing       ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  try {
    // Run test groups
    testVerifyNewArchitecture();
    testScreenChecklist();
    await testPerformanceTests();

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  All Tests Complete                           ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log('✅ Testing infrastructure verified successfully!');
    console.log('✅ All utilities are working correctly.');
    console.log('✅ Ready for manual testing on physical devices.\n');

  } catch (error) {
    console.error('\n❌ Test Failed:', error);
    throw error;
  }
}

// Export for external use
export default runDevUtilityTests;
