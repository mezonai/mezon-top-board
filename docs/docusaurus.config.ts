import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Mezon Top Board', 
  tagline: 'Comprehensive Guide for Mezon Top Board',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://top.mezon.ai/', 
  baseUrl: '/how-to-use/', 
  organizationName: 'mezonai', 
  projectName: 'mezon-top-board', 

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts', 
          routeBasePath: '/', 
        },
        blog: false, 
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Mezon Top Board', 
      logo: {
        alt: 'Mezon Top Board Logo',
        src: 'img/favicon.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar', 
          position: 'left',
          label: 'Docs', 
        },
        {
          href: 'https://github.com/mezonai/mezon-top-board', 
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/intro', 
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/nccplusvietnam',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/nccplus-vietnam/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/mezonai/mezon-top-board',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mezon Top Board. Built with Docusaurus.`, 
    },
  prism: {},
  } satisfies Preset.ThemeConfig,
};

export default config;