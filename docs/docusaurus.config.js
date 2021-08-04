module.exports = {
  title: 'React Native Admob Native Ads',
  tagline: 'Admob for React Native with powerful hooks',
  url: 'https://react-native-admob.github.io/',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'react-native-admob',
  projectName: 'admob',
  themeConfig: {
    navbar: {
      title: 'React Native Admob',
      items: [
        {
          to: 'docs/introduction',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/react-native-admob/admob',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/react-native-admob/admob',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jay Kim, Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/react-native-admob/admob/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
