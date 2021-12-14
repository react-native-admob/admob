import { ViewProps } from 'react-native';

import BannerAdSize from './constants/BannerAdSize';
import AdError from './AdError';

export type MaxAdContentRating = 'G' | 'MA' | 'PG' | 'T';

export interface RequestConfiguration {
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
}

export interface RequestOptions {
  /**
   * If `true` only non-personalized ads will be loaded.
   *
   * Google serves personalized ads by default. This option must be `true` if users who are within the EEA have only
   * given consent to non-personalized ads.
   */
  requestNonPersonalizedAdsOnly?: boolean;

  /**
   * Additional properties attached to an ad request.
   *
   * Takes an array of string key/value pairs.
   *
   * #### Example
   *
   * Attaches `?campaign=abc&user=123` to the ad request:
   *
   * ```js
   * await interstitialAd.requestAd({
   *   networkExtras: {
   *     campaign: 'abc',
   *     user: '123',
   *   },
   * });
   */
  networkExtras?: { [key: string]: string };

  /**
   * An array of keywords to be sent when loading the ad.
   *
   * Setting keywords helps deliver more specific ads to a user based on the keywords.
   *
   * #### Example
   *
   * ```js
   * await interstitialAd.requestAd({
   *   keywords: ['fashion', 'clothing'],
   * });
   * ```
   */
  keywords?: string[];

  /**
   * Content URL for targeting purposes.
   *
   * Max length of 512.
   */
  contentUrl?: string;

  /**
   * The latitude and longitude location of the user.
   *
   * Ensure your app requests location permissions from the user.
   *
   * #### Example
   *
   * ```js
   * await interstitialAd.requestAd({
   *   location: [53.481073, -2.237074],
   * });
   * ```
   */
  location?: [number, number];

  /**
   * Location accuracy if the location is set, in meters.
   *
   * This option is only applied to iOS devices. On Android, this option has no effect.
   *
   * @ios
   */
  locationAccuracy?: number;

  /**
   * Custom key-value pairs to target Google Ad Manager campaigns.
   *
   * Takes an object.
   *
   * #### Example
   *
   * ```js
   * await interstitialAd.requestAd({
   *   targets: {
   *     age: '25',
   *   },
   * });
   */
  targets?: { [key: string]: string };

  /**
   * Server Side Verification(SSV) Options
   * See [Google Mobile SDK Docs](https://developers.google.com/admob/android/ssv) for more information.
   */
  serverSideVerificationOptions?: ServerSideVerificationOptions;
}

export interface ServerSideVerificationOptions {
  /**
   * User identifier.
   * If no user identifier is provided by the app, this query parameter will not be present in the SSV callback.
   */
  userId?: string;

  /**
   * Custom data string.
   * If no custom data string is provided by the app, this query parameter value will not be present in the SSV callback.
   */
  customData?: string;
}

export interface InitializationStatus {
  name: string;
  description: string;
  isReady: boolean;
}

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
   * Optional RequestOptions used to load the ad.
   */
  requestOptions?: RequestOptions;

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

export interface GAMBannerAdProps extends Omit<BannerAdProps, 'size'> {
  /**
   * The available sizes of the banner. Can be a predefined sizes via `BannerAdSize` or custom dimensions, e.g. `300x200`.
   */
  sizes?: string[];
  /**
   * A callback that gets called when the Ad Manager specific app events occurred.
   */
  onAppEvent?: (name: string, info: string) => void;
}

export type AdType =
  | 'Interstitial'
  | 'Rewarded'
  | 'RewardedInterstitial'
  | 'AppOpen';

export type FullScreenAdEvent =
  | 'adPresented'
  | 'adFailedToPresent'
  | 'adDismissed'
  | 'adLoaded'
  | 'adFailedToLoad';

export type RewardedAdEvent = FullScreenAdEvent | 'rewarded';

export type FullScreenAdHandlerType = (() => void) | ((error: AdError) => void);

export type RewardedAdHandlerType =
  | FullScreenAdHandlerType
  | ((reward: Reward) => void);

export interface Reward {
  type: string;
  amount: number;
}

export interface FullScreenAdOptions {
  /**
   * Whether your ad to load automatically on mounted. Defaults to `true`.
   */
  loadOnMounted?: boolean;
  /**
   * Whether your ad to show automatically on loaded. Defaults to `false`.
   */
  showOnLoaded?: boolean;
  /**
   * Whether your ad to load new ad automatically on dismissed. Defaults to `false`.
   */
  loadOnDismissed?: boolean;
  /**
   * Optional RequestOptions used to load the ad.
   */
  requestOptions?: RequestOptions;
}

export interface FullScreenAdState {
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
   * Error during ad load.
   */
  adLoadError?: AdError;
  /**
   * Error during ad present.
   */
  adPresentError?: AdError;
  /**
   * Reward earned by Rewarded Ad.
   */
  reward?: Reward;
}

export interface AdHookReturns extends FullScreenAdState {
  /**
   * Whether your ad is showing.
   * The value is equal with `adPresented && !adDismissed`.
   */
  adShowing: boolean;
  /**
   * Loads new ad.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  load: (requestOptions?: RequestOptions) => void;
  /**
   * Shows loaded ad.
   */
  show: () => void;
}

export interface AppOpenAdOptions {
  /**
   * Whether to show App Open Ad on app cold start. Defaults to `false`.
   * @see {@link https://developers.google.com/admob/android/app-open-ads#coldstart}
   */
  showOnColdStart?: boolean;
  /**
   * Whether to show App Open Ad on app becomes foreground. Defaults to `true`.
   */
  showOnAppForeground?: boolean;
  /**
   * Whether App Open Ad to load new ad automatically on dismissed. Defaults to `true`.
   */
  loadOnDismissed?: boolean;
  /**
   * Optional RequestOptions used to load the ad.
   */
  requestOptions?: RequestOptions;
}
