/**
 * New Architecture Verification Utilities
 * Development-only utilities to verify Fabric/TurboModules are enabled
 */

import { Platform, NativeModules, UIManager } from 'react-native';

export interface NewArchitectureInfo {
  platform: string;
  newArchEnabled: boolean;
  hermesEnabled: boolean;
  turboModulesEnabled: boolean;
  fabricEnabled: boolean;
}

/**
 * Verify New Architecture is enabled
 * Call this from app root in DEV mode to confirm New Architecture is active
 */
export const verifyNewArchitecture = (): NewArchitectureInfo => {
  const constants = NativeModules.PlatformConstants as Record<string, unknown> | undefined;

  // Check for Hermes
  const hermesEnabled = !!(globalThis as Record<string, unknown>).HermesInternal;

  // Check for TurboModules (isTurboModuleEnabled indicates New Architecture)
  const turboModulesEnabled = constants?.isTurboModuleEnabled === true;

  // Check for Fabric features (available in New Architecture)
  // UIManager.getViewManagerConfig is available when Fabric is enabled
  const fabricEnabled = !!(UIManager as Record<string, unknown>).getViewManagerConfig;

  const info: NewArchitectureInfo = {
    platform: Platform.OS,
    newArchEnabled: turboModulesEnabled,
    hermesEnabled,
    turboModulesEnabled,
    fabricEnabled,
  };

  if (__DEV__) {
    console.log('=== New Architecture Verification ===');
    console.log('Platform:', info.platform);
    console.log('New Architecture Enabled:', info.newArchEnabled);
    console.log('Hermes Enabled:', info.hermesEnabled);
    console.log('TurboModules Enabled:', info.turboModulesEnabled);
    console.log('Fabric Enabled:', info.fabricEnabled);
    console.log('======================================');
  }

  return info;
};

/**
 * Get list of available TurboModules
 */
export const getTurboModules = (): string[] => {
  const modules = Object.keys(NativeModules);

  const turboModules = modules.filter((module) => {
    try {
      return (NativeModules as Record<string, unknown>)[module as keyof typeof NativeModules] !== undefined &&
        typeof (NativeModules as Record<string, Record<string, unknown>>)[module]?.__turboModuleProxy === 'object';
    } catch {
      return false;
    }
  });

  if (__DEV__) {
    console.log('TurboModules:', turboModules);
  }

  return turboModules;
};

/**
 * Verify React Native version supports New Architecture
 */
export const verifyReactNativeVersion = (): boolean => {
  // React Native 0.81+ has stable New Architecture support
  const nativeVersion = (UIManager as Record<string, Record<string, number>>).ReactNativeVersion;
  const majorVersion = nativeVersion?.major ?? 0;
  const minorVersion = nativeVersion?.minor ?? 0;

  const supportsNewArchitecture = majorVersion > 81 || (majorVersion === 81 && minorVersion >= 0);

  if (__DEV__) {
    console.log('React Native Version:', nativeVersion);
    console.log('Supports New Architecture:', supportsNewArchitecture);
  }

  return supportsNewArchitecture;
};
