import { NativeModules } from 'react-native';

const RNAdMobAdManager = NativeModules.RNAdMobAdManager;

async function setRequestConfiguration(config) {
  return RNAdMobAdManager.setRequestConfiguration(config || {});
}

async function isTestDevice() {
  return RNAdMobAdManager.isTestDevice();
}

export default {
  setRequestConfiguration,
  isTestDevice,
};
