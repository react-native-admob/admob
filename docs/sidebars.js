module.exports = {
  sideBar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['introduction', 'examples', 'installation'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          Hooks: ['api/useInterstitialAd', 'api/useRewardedAd'],
        },
        {
          Ads: ['api/InterstitialAd', 'api/RewardedAd'],
        },
        {
          AdManager: ['api/setRequestConfiguration', 'api/isTestDevice'],
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Components',
      items: ['components/banner'],
      collapsed: false,
    },
  ],
};
