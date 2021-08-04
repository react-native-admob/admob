import { NativeModules } from 'react-native';

import { InitializationStatus, RequestConfiguration } from './types';

const RNAdMobAdManager = NativeModules.RNAdMobAdManager;

/**
 * Initializes Mobile Ads SDK.
 */
async function initialize(): Promise<InitializationStatus[]> {
  return RNAdMobAdManager.initialize();
}

function setRequestConfiguration(config?: RequestConfiguration) {
  RNAdMobAdManager.setRequestConfiguration(config || {});
}

async function isTestDevice(): Promise<boolean> {
  return RNAdMobAdManager.isTestDevice();
}

export default {
  initialize,
  setRequestConfiguration,
  isTestDevice,
};
