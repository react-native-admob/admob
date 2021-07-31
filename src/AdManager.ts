import { NativeModules } from 'react-native';

import { AdManagerConfiguration, InitializationStatus } from './types';

const RNAdMobAdManager = NativeModules.RNAdMobAdManager;

async function setRequestConfiguration(
  config?: AdManagerConfiguration
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
