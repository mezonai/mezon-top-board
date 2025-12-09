import { cva } from 'class-variance-authority'
import { TypographyVariant, TypographyWeight } from '@app/enums/typography.enum'

export const typographyClasses = cva('flex items-center', {
  variants: {
    variant: {
      [TypographyVariant.H1]: 'text-3xl',
      [TypographyVariant.H2]: 'text-2xl',
      [TypographyVariant.H3]: 'text-xl',
      [TypographyVariant.H4]: 'text-lg',
      [TypographyVariant.H5]: 'text-sm',
      [TypographyVariant.P]: 'text-md'
    },
    weight: {
      [TypographyWeight.BOLD]: '!font-bold',
      [TypographyWeight.NORMAL]: '!font-normal',
      [TypographyWeight.ITALIC]: '!italic',
      [TypographyWeight.SEMIBOLD]: '!font-semibold',
      [TypographyWeight.LIGHT]: '!font-light',
      [TypographyWeight.EXTRABOLD]: '!font-extrabold'
    }
  },
  defaultVariants: {
    weight: TypographyWeight.BOLD,
    variant: TypographyVariant.H1
  }
})
