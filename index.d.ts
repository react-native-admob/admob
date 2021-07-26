import React from 'react';
import type { ViewProps } from 'react-native';

export type BannerAdSize =
  | 'banner'
  | 'largeBanner'
  | 'mediumRectangle'
  | 'fullBanner'
  | 'leaderboard'
  | 'adaptiveBanner';

export type AppEvent = {
  name: string;
  info: string;
};

export interface BannerAdProps extends ViewProps {
  /**
   * AdMob iOS library banner size constants
   * (https://developers.google.com/admob/ios/banner)
   * banner (320x50, Standard Banner for Phones and Tablets)
   * largeBanner (320x100, Large Banner for Phones and Tablets)
   * mediumRectangle (300x250, IAB Medium Rectangle for Phones and Tablets)
   * fullBanner (468x60, IAB Full-Size Banner for Tablets)
   * leaderboard (728x90, IAB Leaderboard for Tablets)
   * adaptiveBanner (320x50, https://developers.google.com/admob/ios/banner/adaptive)
   *
   * banner is default
   */
  adSize?: BannerAdSize;

  /**
   * AdMob ad unit ID
   */
  adUnitID: string;

  /**
   * AdMob iOS library events
   */
  onSizeChange?: (size: { height: number; width: number }) => void;

  onAdLoaded?: () => void;
  onAdFailedToLoad?: (err: Error) => void;
  onAdOpened?: () => void;
  onAdClosed?: () => void;
}

export class BannerAd extends React.Component<AdMobBannerProps> {
  loadAd: () => void;
}

export interface PublisherBannerAdProps extends BannerAdProps {
  adSize?: BannerAdSize | 'fluid';

  /**
   * Optional array specifying all valid sizes that are appropriate for this slot.
   */
  validAdSizes?: string[];

  onAppEvent?: (event: AppEvent) => void;
}

export class PublisherBannerAd extends React.Component<PublisherBannerAdProps> {
  loadAd: () => void;
}

export type FullScreenContentEvent =
  | 'adPresented'
  | 'adFailedToPresent'
  | 'adDismissed';

export const InterstitialAd: {
  setAdUnitID: (adUnitID: string) => void;
  requestAd: () => Promise<void>;
  presentAd: () => Promise<void>;
  addEventListener: (event: FullScreenContentEvent, handler: Function) => void;
  removeEventListener: (type: unknown, handler: Function) => void;
  removeAllListeners: () => void;
};

export const RewardedAd: {
  setAdUnitID: (adUnitID: string) => void;
  requestAd: () => Promise<unknown>;
  presentAd: () => Promise<unknown>;
  addEventListener: (
    event: FullScreenContentEvent | 'rewarded',
    handler: Function
  ) => void;
  removeEventListener: (type: unknown, handler: Function) => void;
  removeAllListeners: () => void;
};

export type Reward = {
  type: string;
  amount: number;
};

/**
 * | Name      | Description |
| --------- | -------- |
| G | "General audiences." Content suitable for all audiences, including families and children.  |
| MA | "Mature audiences." Content suitable only for mature audiences; includes topics such as alcohol, gambling, sexual content, and weapons.  |
| PG | "Parental guidance." Content suitable for most audiences with parental guidance, including topics like non-realistic, cartoonish violence.  |
| T | "Teen." Content suitable for teen and older audiences, including topics such as general health, social networks, scary imagery, and fight sports. |
| UNSPECIFIED | Set default value to ""|
 */
type MAX_AD_CONTENT_RATING = 'G' | 'MA' | 'PG' | 'T' | 'UNSPECIFIED';

type AdManagerConfiguration = {
  maxAdContentRating: MAX_AD_CONTENT_RATING;
  tagForChildDirectedTreatment: boolean;
  tagForUnderAgeConsent: boolean;
  testDeviceIds: Array<string>;
  trackingAuthorized: boolean;
};

export enum AdapterState {
  NOT_READY,
  READY,
}

type MediationAdapterStatus = {
  name: string;
  description: string;
  state: AdapterState;
};

export const AdManager: {
  /**
    * Configure your Ad Requests during App Startup. You need to pass a single object as an argument with atleast one of the following properties

   | Name      | Type | Required |
   | --------- | -------- | -------- |
   | testDeviceIds | `Array<string>` | no  |
   | maxAdContentRating | AdManager.MAX_AD_CONTENT_RATING | no  |
   | tagForChildDirectedTreatment | AdManager.TAG_FOR_CHILD_DIRECTED_TREATMENT | no  |
   | tagForUnderAgeConsent | AdManager.TAG_FOR_UNDER_AGE_CONSENT | no  |

   Example:

   ```js

   const config = {
     testDeviceIds:["YOUR_TEST_DEVICE_ID"],
     maxAdContetRating: 'MA',
     tagForChildDirectedTreatment: false,
     tagForUnderAgeConsent: false
   }

   AdManager.setRequestConfiguration(config);

   ```
    *
    */

  setRequestConfiguration: (
    config: Partial<AdManagerConfiguration>
  ) => Promise<MediationAdapterStatus[]>;

  /**
     * Check if the current device is registered as a test device to show test ads.

  ```js
    AdManager.isTestDevice().then(result => console.log(result))
  ```
  return: `boolean`
     */
  isTestDevice: () => Promise<boolean>;
};
