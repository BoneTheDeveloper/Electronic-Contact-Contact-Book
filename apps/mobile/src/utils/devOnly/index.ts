/**
 * Development Testing Utilities
 * Central export for all dev-only testing and verification utilities
 *
 * IMPORTANT: These utilities are for development only and should be
 * removed or tree-shaken in production builds.
 */

import {
  verifyNewArchitecture,
  getTurboModules,
  verifyReactNativeVersion,
  type NewArchitectureInfo,
} from './verifyNewArchitecture';

import {
  SCREEN_CHECKLIST,
  getScreensByCategory,
  getCriticalScreens,
  getTotalScreenCount,
  getCriticalScreenCount,
  printChecklist,
  validateScreenCount,
  type ScreenChecklistItem,
  type ScreenTestResult,
} from './screenChecklist';

import {
  measurePerformance,
  measureNavigation,
  measureScrollPerformance,
  measureMemoryUsage,
  runPerformanceTests,
  measureAppStartup,
  initStartupMeasurement,
  formatPerformanceReport,
  type PerformanceMetrics,
  type PerformanceReport,
} from './performanceTest';

// Re-export for convenience
export {
  verifyNewArchitecture,
  getTurboModules,
  verifyReactNativeVersion,
  SCREEN_CHECKLIST,
  getScreensByCategory,
  getCriticalScreens,
  getTotalScreenCount,
  getCriticalScreenCount,
  printChecklist,
  validateScreenCount,
  measurePerformance,
  measureNavigation,
  measureScrollPerformance,
  measureMemoryUsage,
  runPerformanceTests,
  measureAppStartup,
  initStartupMeasurement,
  formatPerformanceReport,
  type NewArchitectureInfo,
  type ScreenChecklistItem,
  type ScreenTestResult,
  type PerformanceMetrics,
  type PerformanceReport,
};

/**
 * Run all verification checks
 * Call this from App.tsx in DEV mode to verify system status
 */
export const runDevChecks = () => {
  if (__DEV__) {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  EContact Mobile - Dev Mode Verification        ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    // New Architecture verification
    const archInfo = verifyNewArchitecture();

    // React Native version check
    const versionSupported = verifyReactNativeVersion();

    // Screen checklist validation
    const screenCountValid = validateScreenCount();

    // Print checklist summary
    printChecklist();

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  Verification Summary                          ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log(`✓ New Architecture: ${archInfo.newArchEnabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`✓ Hermes: ${archInfo.hermesEnabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`✓ Fabric: ${archInfo.fabricEnabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`✓ TurboModules: ${archInfo.turboModulesEnabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`✓ Version Supported: ${versionSupported ? 'YES' : 'NO'}`);
    console.log(`✓ Screen Count: ${screenCountValid ? 'VALID' : 'INVALID'}\n`);

    // List TurboModules if available
    if (archInfo.turboModulesEnabled) {
      getTurboModules();
    }

    console.log('════════════════════════════════════════════════\n');
  }
};
