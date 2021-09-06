module.exports = {
  sideBar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['installation', 'usage', 'examples'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          Hooks: [
            'api/useAppOpenAd',
            'api/useInterstitialAd',
            'api/useRewardedAd',
            'api/useRewardedInterstitialAd',
          ],
        },
        {
          Ads: [
            'api/AppOpenAd',
            'api/InterstitialAd',
            'api/RewardedAd',
            'api/RewardedInterstitialAd',
          ],
        },
        {
          type: 'doc',
          id: 'api/RequestOptions',
          label: 'RequestOptions',
        },
        {
          AdMob: [
            'api/initialize',
            'api/setRequestConfiguration',
            'api/isTestDevice',
          ],
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Components',
      items: ['components/BannerAd', 'components/GAMBannerAd'],
      collapsed: false,
    },
  ],
};
