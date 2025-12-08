import { Config } from 'tailwindcss'
import { TinyColor } from '@ctrl/tinycolor'

const tailwindPreset: Config = {
  theme: {
    extend: {
      colors: {
        bg: {
            DEFAULT: 'var(--bg-body)',
            container: 'var(--bg-container)',
            secondary: 'var(--bg-container-secondary)',
        },
        text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
        },
        primary: {
          default: '#F2385A',
          hover: new TinyColor('#F2385A').lighten(5).toString(),
          active: new TinyColor('#F2385A').lighten(10).toString(),
          border: new TinyColor('#F2385A').setAlpha(0.2).toString()
        },
        secondary: {
          default: '#F25E86',
          hover: new TinyColor('#F25E86').lighten(5).toString(),
          active: new TinyColor('#F25E86').lighten(10).toString(),
          border: new TinyColor('#F25E86').setAlpha(0.2).toString()
        },
        default: {
          default: '#fff',
          hover: new TinyColor('#000').lighten(5).toString(),
          active: new TinyColor('#000').lighten(10).toString(),
          border: new TinyColor('#000').setAlpha(0.2).toString()
        }
      },
      boxShadow: {
        sm: '0px 2px 4px 0px rgba(11, 10, 55, 0.15)',
        lg: '0px 8px 20px 0 rgba(18, 16, 99, 0.06)'
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
