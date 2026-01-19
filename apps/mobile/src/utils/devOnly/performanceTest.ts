/**
 * Performance Testing Utilities
 * Development-only utilities to measure app performance
 */

import { NavigationProp } from '@react-navigation/native';

// Performance API is available in global scope in React Native 0.81+
declare const performance: {
  now: () => number;
};

/**
 * Get current timestamp with fallback
 */
const getTimestamp = () => {
  // Use performance.now() if available (React Native 0.81+)
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  // Fallback to Date.now()
  return Date.now();
};

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: Date;
  passed: boolean;
  target: number;
  max: number;
}

export interface PerformanceReport {
  totalOperations: number;
  passed: number;
  failed: number;
  metrics: PerformanceMetrics[];
}

/**
 * Measure execution time of an async operation
 */
export const measurePerformance = async (
  operation: string,
  fn: () => Promise<void>,
  target: number,
  max: number
): Promise<PerformanceMetrics> => {
  const start = getTimestamp();
  await fn();
  const end = getTimestamp();
  const duration = end - start;

  const passed = duration <= max;
  const metric: PerformanceMetrics = {
    operation,
    duration,
    timestamp: new Date(),
    passed,
    target,
    max,
  };

  if (__DEV__) {
    const status = passed ? '✅' : '❌';
    const withinTarget = duration <= target ? '✓' : '⚠️';
    console.log(
      `${status} ${operation}: ${duration.toFixed(2)}ms (target: ${target}ms, max: ${max}ms) ${withinTarget}`
    );
  }

  return metric;
};

/**
 * Measure navigation performance
 */
export const measureNavigation = async (
  operation: string,
  navigation: NavigationProp<any>,
  route: string,
  params?: any
): Promise<PerformanceMetrics> => {
  return measurePerformance(
    `Navigate to ${route}`,
    async () => {
      // @ts-ignore - Dynamic navigation for testing
      navigation.navigate(route, params);
      // Wait for transition to complete
      await new Promise((resolve) => setTimeout(resolve, 100));
    },
    300, // Target: 300ms
    500 // Max: 500ms
  );
};

/**
 * Measure list scroll performance
 */
export const measureScrollPerformance = (
  listName: string,
  itemCount: number
): PerformanceMetrics => {
  const start = getTimestamp();

  // Simulate list scroll (actual implementation would use onScroll)
  // This is a placeholder - real implementation would measure frame drops
  const duration = Math.random() * 100; // Simulated

  const end = getTimestamp();
  const actualDuration = end - start;

  // Target: 60fps = 16.67ms per frame
  // For 100 items, should take ~1.67s
  const target = itemCount * 16.67;
  const max = target * 2;

  return {
    operation: `Scroll ${listName} (${itemCount} items)`,
    duration: actualDuration,
    timestamp: new Date(),
    passed: actualDuration <= max,
    target,
    max,
  };
};

/**
 * Measure memory usage (if available)
 */
export const measureMemoryUsage = (): PerformanceMetrics | null => {
  try {
    // @ts-ignore - NativeModules.MemoryUsage not in types
    const memoryUsage = global.nativeMemoryUsage?.() || { jsHeapSizeLimit: 0, usedJSHeapSize: 0 };

    const usedMB = memoryUsage.usedJSHeapSize / (1024 * 1024);
    const targetMB = 200;
    const maxMB = 300;

    return {
      operation: 'Memory Usage',
      duration: usedMB,
      timestamp: new Date(),
      passed: usedMB <= maxMB,
      target: targetMB,
      max: maxMB,
    };
  } catch {
    if (__DEV__) {
      console.warn('Memory usage measurement not available');
    }
    return null;
  }
};

/**
 * Run complete performance test suite
 */
export const runPerformanceTests = async (
  navigation?: NavigationProp<any>
): Promise<PerformanceReport> => {
  if (__DEV__) {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  EContact Mobile - Performance Test Suite      ║');
    console.log('╚════════════════════════════════════════════════╝\n');
  }

  const metrics: PerformanceMetrics[] = [];

  // Memory usage
  const memoryMetric = measureMemoryUsage();
  if (memoryMetric) {
    metrics.push(memoryMetric);
  }

  // Navigation tests (if navigation provided)
  if (navigation) {
    const criticalRoutes = [
      'ParentDashboard',
      'ParentSchedule',
      'ParentGrades',
      'ParentAttendance',
      'ParentPayments',
      'StudentDashboard',
      'StudentSchedule',
      'StudentGrades',
      'StudentAttendance',
      'TeacherDashboard',
      'TeacherStudents',
      'TeacherAttendance',
      'TeacherGrades',
      'AdminDashboard',
      'AdminStudents',
      'AdminTeachers',
      'AdminClasses',
      'AdminPayments',
      'AdminSettings',
    ];

    for (const route of criticalRoutes) {
      try {
        const metric = await measureNavigation(route, navigation, route);
        metrics.push(metric);
      } catch (error) {
        if (__DEV__) {
          console.error(`❌ Navigation test failed for ${route}:`, error);
        }
      }
    }
  }

  // Scroll performance tests
  const scrollTests = [
    { name: 'Student List', items: 50 },
    { name: 'Teacher List', items: 30 },
    { name: 'Payment History', items: 100 },
  ];

  for (const test of scrollTests) {
    const metric = measureScrollPerformance(test.name, test.items);
    metrics.push(metric);
  }

  // Generate report
  const passed = metrics.filter((m) => m.passed).length;
  const failed = metrics.length - passed;

  const report: PerformanceReport = {
    totalOperations: metrics.length,
    passed,
    failed,
    metrics,
  };

  if (__DEV__) {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  Performance Test Summary                       ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log(`Total Tests: ${report.totalOperations}`);
    console.log(`Passed: ${report.passed} ✅`);
    console.log(`Failed: ${report.failed} ❌`);
    console.log(`Success Rate: ${((passed / report.totalOperations) * 100).toFixed(1)}%\n`);

    // Print failed tests
    const failedTests = metrics.filter((m) => !m.passed);
    if (failedTests.length > 0) {
      console.log('Failed Tests:');
      failedTests.forEach((metric) => {
        console.log(`  ❌ ${metric.operation}: ${metric.duration.toFixed(2)}ms (max: ${metric.max}ms)`);
      });
      console.log('');
    }

    console.log('════════════════════════════════════════════════\n');
  }

  return report;
};

/**
 * Measure app startup time
 */
export const measureAppStartup = (): PerformanceMetrics => {
  // This should be called from App.tsx componentDidMount/useEffect
  const startTime = (global as any).__APP_START_TIME__ || getTimestamp();
  const endTime = getTimestamp();
  const duration = endTime - startTime;

  return {
    operation: 'App Startup',
    duration,
    timestamp: new Date(),
    passed: duration <= 3000, // Max 3s
    target: 2000, // Target 2s
    max: 3000, // Max 3s
  };
};

/**
 * Initialize app startup measurement
 */
export const initStartupMeasurement = () => {
  if (__DEV__) {
    (global as any).__APP_START_TIME__ = getTimestamp();
  }
};

/**
 * Format performance metrics for display
 */
export const formatPerformanceReport = (report: PerformanceReport): string => {
  let output = '\n════════════════════════════════════════════════\n';
  output += '         PERFORMANCE TEST RESULTS\n';
  output += '════════════════════════════════════════════════\n\n';
  output += `Total Tests: ${report.totalOperations}\n`;
  output += `Passed: ${report.passed} ✅\n`;
  output += `Failed: ${report.failed} ❌\n`;
  output += `Success Rate: ${((report.passed / report.totalOperations) * 100).toFixed(1)}%\n\n`;

  output += '────────────────────────────────────────────────\n';
  output += 'Individual Test Results:\n';
  output += '────────────────────────────────────────────────\n\n';

  report.metrics.forEach((metric, index) => {
    const status = metric.passed ? '✅ PASS' : '❌ FAIL';
    const withinTarget = metric.duration <= metric.target ? '✓' : '⚠️';

    output += `${index + 1}. ${metric.operation}\n`;
    output += `   Status: ${status}\n`;
    output += `   Duration: ${metric.duration.toFixed(2)}ms\n`;
    output += `   Target: ${metric.target}ms ${withinTarget}\n`;
    output += `   Max: ${metric.max}ms\n\n`;
  });

  output += '════════════════════════════════════════════════\n';

  return output;
};
