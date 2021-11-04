module.exports = {
  title: 'React Native Admob Native Ads',
  tagline: 'Admob for React Native with powerful hooks',
  url: 'https://react-native-admob.github.io/',
  baseUrl: '/admob/',
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
          to: 'docs/installation',
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
    prism: {
      additionalLanguages: ['ruby'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarItemsGenerator: async function ({
            defaultSidebarItemsGenerator,
            docs,
            ...args
          }) {
            const filteredDocs = docs.filter(
              (doc) =>
                !doc.id.toLowerCase().includes('fullscreenad') ||
                doc.id.toLowerCase().includes('options')
            );
            const sidebarItems = await defaultSidebarItemsGenerator({
              docs: filteredDocs,
              ...args,
            });
            return sidebarItems;
          },
          editUrl:
            'https://github.com/react-native-admob/admob/edit/master/docs/',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
