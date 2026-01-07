import { Config } from 'tailwindcss'
import { TinyColor } from '@ctrl/tinycolor'

const tailwindPreset: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--accent-primary)',
          hover: new TinyColor('#F2385A').lighten(5).toString(),
          active: new TinyColor('#F2385A').lighten(10).toString(),
          border: new TinyColor('#F2385A').setAlpha(0.2).toString()
        },
        secondary: {
          DEFAULT: 'var(--accent-secondary)',
          hover: new TinyColor('#F25E86').lighten(5).toString(),
          active: new TinyColor('#F25E86').lighten(10).toString(),
          border: new TinyColor('#F25E86').setAlpha(0.2).toString()
        },
        success: {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
          border: 'var(--color-success-border)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
          border: 'var(--color-warning-border)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          bg: 'var(--color-danger-bg)',
          border: 'var(--color-danger-border)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          bg: 'var(--color-info-bg)',
          border: 'var(--color-info-border)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
          footer: 'var(--border-footer)',
          table: 'var(--border-table)',
          subtle: 'var(--border-subtle)',
          emphasis: 'var(--border-emphasis)',
        },
      },

      backgroundColor: {
        DEFAULT: 'var(--bg-body)',
        heading: 'var(--accent-primary)',
        container: 'var(--bg-container)',
        secondary: 'var(--bg-container-secondary)',
        elevated: 'var(--bg-elevated)',
        content: 'var(--bg-content)',
        sidebar: 'var(--bg-sidebar)',
        body: 'var(--bg-body)',
        'table-header': 'var(--bg-table-header)',
        hover: 'var(--bg-hover)',
      },

      textColor: {
        heading: 'var(--accent-primary)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
        breadcrumb: 'var(--text-breadcrumb)',
        sidebar: 'var(--text-sidebar)',
        'sidebar-label': 'var(--text-sidebar-label)',
        'sidebar-active': 'var(--text-sidebar-active)',
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      boxShadow: {
        ssm: '0px 2px 4px 0px rgba(11, 10, 55, 0.15)',
        lg: '0px 8px 20px 0 rgba(18, 16, 99, 0.06)',
        'dark-sm': 'var(--shadow-sm)',
        'dark-md': 'var(--shadow-md)',
        'dark-lg': 'var(--shadow-lg)',
        'glow': 'var(--shadow-glow)',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '14px' }],
        md: ['14px', { lineHeight: '17px' }],
        sm: ['16px', { lineHeight: '19px' }],
        lg: ['24px', { lineHeight: '29px' }],
        xl: ['28px', { lineHeight: '34px' }],
        '2xl': ['32px', { lineHeight: '38px' }],
        '3xl': ['40px', { lineHeight: '48px' }]
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif']
      }
    }
  }
}

export default tailwindPreset