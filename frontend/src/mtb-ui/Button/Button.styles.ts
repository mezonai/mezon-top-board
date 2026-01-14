import { cva } from 'class-variance-authority'
import { TinyColor } from '@ctrl/tinycolor'
import { ThemeConfig } from 'antd'
import { EButtonColor, EButtonVariant } from '@app/enums/button.enum'

const BRAND_COLOR = '#F2385A'

export const getButtonTheme = (baseColor: string = BRAND_COLOR): ThemeConfig => {
  const colorInstance = new TinyColor(baseColor)

  return {
    components: {
      Button: {
        colorPrimary: baseColor,
        colorPrimaryBorder: colorInstance.clone().setAlpha(0.2).toString(),
        colorPrimaryHover: colorInstance.clone().setAlpha(1).toString(), 
        colorPrimaryTextHover: colorInstance.clone().setAlpha(0.8).toString(),
        colorPrimaryBgHover: colorInstance.clone().setAlpha(0.1).toString(),
        colorPrimaryActive: colorInstance.clone().lighten(10).toString(),
        colorPrimaryTextActive: colorInstance.clone().lighten(10).toString(),
      },
    },
  }
}

export const buttonVariants = cva('!shadow-none transition-all duration-200 hover:opacity-75', {
  variants: {
    color: {
      [EButtonColor.DEFAULT]: '!border-border !text-primary',
      [EButtonColor.PRIMARY]: '!border-primary !text-heading',
      [EButtonColor.DANGER]: '!border-danger !text-danger',
      [EButtonColor.PINK]: '!border-pink-500 !text-pink-500',
      [EButtonColor.PURPLE]: '!border-purple-500 !text-purple-500',
      [EButtonColor.CYAN]: '!border-cyan-500 !text-cyan-500',
      [EButtonColor.BLUE]: '!border-blue-500 !text-blue-500',
    },
    variant: {
      [EButtonVariant.SOLID]: '!border !text-white',
      [EButtonVariant.OUTLINED]: '!bg-transparent !border',
      [EButtonVariant.DASHED]: '!bg-transparent !border !border-dashed',
      [EButtonVariant.FILLED]: '!border',
      [EButtonVariant.TEXT]: '!bg-transparent !border-transparent',
      [EButtonVariant.LINK]: '!bg-transparent !border-transparent underline underline-offset-2',
    },
  },
  compoundVariants: [
    {
      color: EButtonColor.DEFAULT,
      variant: EButtonVariant.SOLID,
      class: '!bg-black !border-border !text-white',
    },
    {
      color: EButtonColor.DEFAULT,
      variant: EButtonVariant.OUTLINED,
      class: 'hover:!bg-black hover:!text-white hover:!border-black',
    },
    {
      color: EButtonColor.DEFAULT,
      variant: EButtonVariant.DASHED,
      class: '!border-border !text-primary',
    },
    {
      color: EButtonColor.DEFAULT,
      variant: EButtonVariant.FILLED,
      class: '!bg-container-secondary !border-border !text-primary',
    },
    {
      color: EButtonColor.DEFAULT,
      variant: EButtonVariant.TEXT,
      class: '!text-primary',
    },
    {
      color: EButtonColor.DEFAULT,
      variant: EButtonVariant.LINK,
      class: '!text-primary',
    },

    {
      color: EButtonColor.PRIMARY,
      variant: EButtonVariant.SOLID,
      class: '!bg-primary !border-primary !text-white',
    },
    {
      color: EButtonColor.PRIMARY,
      variant: EButtonVariant.OUTLINED,
      class: 'hover:!bg-heading hover:!text-white hover:!border-heading',
    },
    {
      color: EButtonColor.PRIMARY,
      variant: EButtonVariant.DASHED,
      class: '!border-primary !text-primary',
    },
    {
      color: EButtonColor.PRIMARY,
      variant: EButtonVariant.FILLED,
      class: '!bg-primary/10 !border-primary !text-primary',
    },
    {
      color: EButtonColor.PRIMARY,
      variant: EButtonVariant.TEXT,
      class: '!text-primary',
    },
    {
      color: EButtonColor.PRIMARY,
      variant: EButtonVariant.LINK,
      class: '!text-primary',
    },

    // DANGER
    {
      color: EButtonColor.DANGER,
      variant: EButtonVariant.SOLID,
      class: '!bg-danger !border-danger !text-white',
    },
    {
      color: EButtonColor.DANGER,
      variant: EButtonVariant.OUTLINED,
      class: '!text-danger !border-danger hover:!bg-danger hover:!text-white',
    },
    {
      color: EButtonColor.DANGER,
      variant: EButtonVariant.DASHED,
      class: '!border-danger !text-danger',
    },
    {
      color: EButtonColor.DANGER,
      variant: EButtonVariant.FILLED,
      class: '!bg-danger/10 !border-danger !text-danger',
    },
    {
      color: EButtonColor.DANGER,
      variant: EButtonVariant.TEXT,
      class: '!text-danger',
    },
    {
      color: EButtonColor.DANGER,
      variant: EButtonVariant.LINK,
      class: '!text-danger',
    },

    // PINK
    {
      color: EButtonColor.PINK,
      variant: EButtonVariant.SOLID,
      class: '!bg-pink-500 !border-pink-500 !text-white',
    },
    {
      color: EButtonColor.PINK,
      variant: EButtonVariant.OUTLINED,
      class: '!text-pink-500 !border-pink-500 hover:!bg-pink-500 hover:!text-white',
    },
    {
      color: EButtonColor.PINK,
      variant: EButtonVariant.DASHED,
      class: '!border-pink-500 !text-pink-500',
    },
    {
      color: EButtonColor.PINK,
      variant: EButtonVariant.FILLED,
      class: '!bg-pink-500/10 !border-pink-500 !text-pink-500',
    },
    {
      color: EButtonColor.PINK,
      variant: EButtonVariant.TEXT,
      class: '!text-pink-500',
    },
    {
      color: EButtonColor.PINK,
      variant: EButtonVariant.LINK,
      class: '!text-pink-500',
    },

    // PURPLE
    {
      color: EButtonColor.PURPLE,
      variant: EButtonVariant.SOLID,
      class: '!bg-purple-500 !border-purple-500 !text-white',
    },
    {
      color: EButtonColor.PURPLE,
      variant: EButtonVariant.OUTLINED,
      class: '!text-purple-500 !border-purple-500 hover:!bg-purple-500 hover:!text-white',
    },
    {
      color: EButtonColor.PURPLE,
      variant: EButtonVariant.DASHED,
      class: '!border-purple-500 !text-purple-500',
    },
    {
      color: EButtonColor.PURPLE,
      variant: EButtonVariant.FILLED,
      class: '!bg-purple-500/10 !border-purple-500 !text-purple-500',
    },
    {
      color: EButtonColor.PURPLE,
      variant: EButtonVariant.TEXT,
      class: '!text-purple-500',
    },
    {
      color: EButtonColor.PURPLE,
      variant: EButtonVariant.LINK,
      class: '!text-purple-500',
    },

    // CYAN
    {
      color: EButtonColor.CYAN,
      variant: EButtonVariant.SOLID,
      class: '!bg-cyan-500 !border-cyan-500 !text-white',
    },
    {
      color: EButtonColor.CYAN,
      variant: EButtonVariant.OUTLINED,
      class: '!text-cyan-500 !border-cyan-500 hover:!bg-cyan-500 hover:!text-white',
    },
    {
      color: EButtonColor.CYAN,
      variant: EButtonVariant.DASHED,
      class: '!border-cyan-500 !text-cyan-500',
    },
    {
      color: EButtonColor.CYAN,
      variant: EButtonVariant.FILLED,
      class: '!bg-cyan-500/10 !border-cyan-500 !text-cyan-500',
    },
    {
      color: EButtonColor.CYAN,
      variant: EButtonVariant.TEXT,
      class: '!text-cyan-500',
    },
    {
      color: EButtonColor.CYAN,
      variant: EButtonVariant.LINK,
      class: '!text-cyan-500',
    },

    // BLUE
    {
      color: EButtonColor.BLUE,
      variant: EButtonVariant.SOLID,
      class: '!bg-blue-500 !border-blue-500 !text-white',
    },
    {
      color: EButtonColor.BLUE,
      variant: EButtonVariant.OUTLINED,
      class: '!text-blue-500 !border-blue-500 hover:!bg-blue-500 hover:!text-white',
    },
    {
      color: EButtonColor.BLUE,
      variant: EButtonVariant.DASHED,
      class: '!border-blue-500 !text-blue-500',
    },
    {
      color: EButtonColor.BLUE,
      variant: EButtonVariant.FILLED,
      class: '!bg-blue-500/10 !border-blue-500 !text-blue-500',
    },
    {
      color: EButtonColor.BLUE,
      variant: EButtonVariant.TEXT,
      class: '!text-blue-500',
    },
    {
      color: EButtonColor.BLUE,
      variant: EButtonVariant.LINK,
      class: '!text-blue-500',
    },
  ],
  defaultVariants: {
    color: EButtonColor.PRIMARY,
    variant: EButtonVariant.SOLID,
  },
})