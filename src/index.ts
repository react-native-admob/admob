import AdMob from './AdMob';

export default AdMob;
export { default as BannerAd } from './ads/BannerAd';
export { default as InterstitialAd } from './ads/InterstitialAd';
export { default as RewardedAd } from './ads/RewardedAd';
export { default as RewardedInterstitialAd } from './ads/RewardedInterstitialAd';
export { default as AppOpenAd } from './ads/AppOpenAd';
export { default as useInterstitialAd } from './hooks/useInterstitialAd';
export { default as useRewardedAd } from './hooks/useRewardedAd';
export { default as useRewardedInterstitialAd } from './hooks/useRewardedInterstitialAd';
export { default as useAppOpenAd } from './hooks/useAppOpenAd';
export { default as BannerAdSize } from './BannerAdSize';

export * from './types';
