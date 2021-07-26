import { NativeModules } from 'react-native';

const RNAdmobAdManager = NativeModules.RNAdmobAdManager;

async function setRequestConfiguration(config) {
  return RNAdmobAdManager.setRequestConfiguration(config);
}

async function isTestDevice() {
  return RNAdmobAdManager.isTestDevice();
}

export default {
  setRequestConfiguration,
  isTestDevice,
};
