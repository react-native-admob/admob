import { ViewProps } from 'react-native';

import BannerAdSize from './BannerAdSize';

export type MaxAdContentRating = 'G' | 'MA' | 'PG' | 'T';

export type RequestConfiguration = {
  /**
   * Maximum Ad Content Rating. Defaults to `UNSPECIFIED`.
   * The following values are currently supported:
   * - "G" - "General audiences." Content suitable for all audiences, including families and children.
   * - "MA" - "Mature audiences." Content suitable only for mature audiences; includes topics such as alcohol, gambling, sexual content, and weapons.
   * - "PG" - "Parental guidance." Content suitable for most audiences with parental guidance, including topics like non-realistic, cartoonish violence.
   * - "T" - "Teen." Content suitable for teen and older audiences, including topics such as general health, social networks, scary imagery, and fight sports.
   * - "UNSPECIFIED" - Set default value to ""
   */
  maxAdContentRating: MaxAdContentRating;
  /**
   * Whether your ad requests to be treated as child-directed. Defaults to `false`.
   */
  tagForChildDirectedTreatment: boolean;
  /**
   * Whether your ad requests to receive treatment for users in the European Economic Area (EEA) and the UK under the age of consent. Defaults to `false`.
   */
  tagForUnderAgeConsent: boolean;
  /**
   * Array of your test devices' ID
   */
  testDeviceIds: Array<string>;
};

export type InitializationStatus = {
  name: string;
  description: string;
  isReady: boolean;
};

export interface BannerAdProps extends ViewProps {
  /**
   * The AdMob unit ID for the banner.
   */
  unitId: string;

  /**
   * The size of the banner. Can be a predefined size via `BannerAdSize` or custom dimensions, e.g. `300x200`.
   */
  size: typeof BannerAdSize | string;

  /**
   * A callback that gets called when an ad's size has changed.
   */
  onSizeChange?: (size: { height: number; width: number }) => void;

  /**
   * A callback that gets called when an ad has finished loading.
   */
  onAdLoaded?: () => void;
  /**
   * A callback that gets called when an ad has failed to load. Callback contains an Error.
   */
  onAdFailedToLoad?: (error: Error) => void;
  /**
   * A callback that gets called when the user tapped the ad and the ad content is now visible to the user.
   */
  onAdOpened?: () => void;
  /**
   * A callback that gets called when the user is about to return to the app after tapping on an ad.
   */
  onAdClosed?: () => void;
}

export interface GAMBannerAdProps extends BannerAdProps {
  /**
   * The available sizes of the banner. Can be a predefined sizes via `BannerAdSize` or custom dimensions, e.g. `300x200`. Available only in AdManager ad.
   */
  sizes?: string[];
  /**
   * A callback that gets called when the Ad Manager specific app events occured. Availbale only in Ad Manager Ad.
   */
  onAppEvent?: (name: string, info: string) => void;
}

export type AdType = 'Interstitial' | 'Rewarded';

export type FullScreenAdEvent =
  | 'adPresented'
  | 'adFailedToPresent'
  | 'adDismissed';

export type InterstitialAdEvent = FullScreenAdEvent;

export type RewardedAdEvent = FullScreenAdEvent | 'rewarded';

export interface FullScreenAdInterface {
  /**
   * Request ad and return Promise.
   */
  requestAd: (requestId: number, unitId: string) => Promise<void>;
  /**
   * Present the loaded ad and return Promise.
   */
  presentAd: (requestId: number) => Promise<void>;
}

export type Reward = {
  type: string;
  amount: number;
};

export type AdHookOptions = {
  /**
   * Whether your ad to request automatically on mounted. Defaults to `true`.
   */
  requestOnMounted?: boolean;
  /**
   * Whether your ad to present automatically on loaded. Defaults to `false`.
   */
  presentOnLoaded?: boolean;
  /**
   * Whether your ad to request new ad automatically on dismissed. Defaults to `false`.
   */
  requestOnDismissed?: boolean;
};

export type AdHookResult = {
  /**
   * Whether your ad is loaded and ready to present.
   */
  adLoaded: boolean;
  /**
   * Whether your ad is presented to user.
   */
  adPresented: boolean;
  /**
   * Whether your ad is dismissed by user.
   */
  adDismissed: boolean;
  /**
   * Whether your ad is showing.
   * The value is equal with `adPresented && !adDismissed`.
   */
  adShowing: boolean;
  /**
   * Error during ad load.
   */
  adLoadError?: Error;
  /**
   * Error during ad present.
   */
  adPresentError?: Error;
  /**
   * Reward earned by Rewarded Ad.
   */
  reward?: Reward;
  /**
   * Request new ad.
   */
  requestAd: () => void;
  /**
   * Present loaded ad.
   */
  presentAd: () => void;
};
