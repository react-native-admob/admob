import { NativeModules } from 'react-native';

import { InitializationStatus, RequestConfiguration } from './types';

const RNAdMobAdManager = NativeModules.RNAdMobAdManager;

async function setRequestConfiguration(
  config?: RequestConfiguration
): Promise<InitializationStatus[]> {
  return RNAdMobAdManager.setRequestConfiguration(config || {});
}

async function isTestDevice(): Promise<boolean> {
  return RNAdMobAdManager.isTestDevice();
}

export default {
  setRequestConfiguration,
  isTestDevice,
};
