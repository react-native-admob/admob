import { NativeModules } from 'react-native';

import { InitializationStatus, RequestConfiguration } from './types';

const RNAdMobAdManager = NativeModules.RNAdMobAdManager;

/**
 * Initializes Mobile Ads SDK.
 * @returns Promise of each mediation adapter's initialization status
 */
async function initialize(): Promise<InitializationStatus[]> {
  return RNAdMobAdManager.initialize();
}

/**
 * Sets ads request configuration to be applied globally.
 * @param config `RequestConfiguration` object
 */
function setRequestConfiguration(config?: RequestConfiguration) {
  RNAdMobAdManager.setRequestConfiguration(config || {});
}

/**
 * Checks if the current device is registered as a test device to show test ads.
 * @returns Promise of boolean weather current device is a test device
 */
async function isTestDevice(): Promise<boolean> {
  return RNAdMobAdManager.isTestDevice();
}

export default {
  initialize,
  setRequestConfiguration,
  isTestDevice,
};
