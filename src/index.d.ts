import React from 'react';
import type { ViewProps } from 'react-native';

export interface BannerAdSize {
  /**
   * Mobile Marketing Association (MMA) banner ad size (320x50 density-independent pixels).
   */
  BANNER: 'BANNER';

  /**
   * Interactive Advertising Bureau (IAB) full banner ad size (468x60 density-independent pixels).
   */
  FULL_BANNER: 'FULL_BANNER';

  /**
   * Large banner ad size (320x100 density-independent pixels).
   */
  LARGE_BANNER: 'LARGE_BANNER';

  /**
   * Interactive Advertising Bureau (IAB) leaderboard ad size (728x90 density-independent pixels).
   */
  LEADERBOARD: 'LEADERBOARD';

  /**
   * Interactive Advertising Bureau (IAB) medium rectangle ad size (300x250 density-independent pixels).
   */
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE';

  /**
   * A (next generation) dynamically sized banner that is full-width and auto-height.
   */
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER';

  /**
   * A dynamically sized banner that matches its parent's width and expands/contracts its height to match the ad's content after loading completes.
   */
  FLUID: 'FLUID';

  /**
   * IAB wide skyscraper ad size (160x600 density-independent pixels). This size is currently not supported by the Google Mobile Ads network; this is intended for mediation ad networks only.
   */
  WIDE_SKYSCRAPER: 'WIDE_SKYSCRAPER';
}

export const BannerAdSize: BannerAdSize;

export interface BannerAdProps extends ViewProps {
  /**
   * The AdMob unit ID for the banner.
   */
  unitId: string;

  /**
   * The size of the banner. Can be a predefined size via `BannerAdSize` or custom dimensions, e.g. `300x200`.
   *
   * Inventory must be available for the banner size specified, otherwise a no-fill error will be sent to `onAdFailedToLoad`.
   */
  size: BannerAdSize | string;

  /**
   * AdMob iOS library events
   */
  onSizeChange?: (size: { height: number; width: number }) => void;

  /**
   * When an ad has finished loading.
   */
  onAdLoaded?: () => void;
  /**
   * When an ad has failed to load. Callback contains an Error.
   */
  onAdFailedToLoad?: (err: Error) => void;
  /**
   * The ad is now visible to the user.
   */
  onAdOpened?: () => void;
  /**
   * Called when the user is about to return to the app after tapping on an ad.
   */
  onAdClosed?: () => void;
}

export class BannerAd extends React.Component<BannerAdProps> {
  loadAd: () => void;
}

export type FullScreenContentEvent =
  | 'adPresented'
  | 'adFailedToPresent'
  | 'adDismissed';

export const InterstitialAd: {
  setUnitId: (unitId: string) => void;
  requestAd: () => Promise<void>;
  presentAd: () => Promise<void>;
  addEventListener: (event: FullScreenContentEvent, handler: Function) => void;
  removeEventListener: (type: unknown, handler: Function) => void;
  removeAllListeners: () => void;
};

export const RewardedAd: {
  setUnitId: (unitId: string) => void;
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
    config?: Partial<AdManagerConfiguration>
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
