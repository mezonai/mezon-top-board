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

export const buttonVariants = cva('!shadow-none transition-all duration-200', {
  variants: {
    color: {
      [EButtonColor.DEFAULT]: '',
      [EButtonColor.PRIMARY]: '',
      [EButtonColor.DANGER]: '',
      [EButtonColor.PINK]: '',
      [EButtonColor.PURPLE]: '',
      [EButtonColor.CYAN]: '',
      [EButtonColor.BLUE]: '',
    },
    variant: {
      [EButtonVariant.SOLID]: '',
      [EButtonVariant.OUTLINED]: '',
      [EButtonVariant.DASHED]: '',
      [EButtonVariant.FILLED]: '',
      [EButtonVariant.TEXT]: '',
      [EButtonVariant.LINK]: '',
    },
  },
  compoundVariants: [
    {
      color: EButtonColor.DEFAULT,
      variant: EButtonVariant.OUTLINED,
      class: 'hover:!bg-black hover:!text-white hover:!border-black',
    },
    {
      color: EButtonColor.PRIMARY,
      variant: EButtonVariant.OUTLINED,
      class: 'hover:!bg-primary-hover hover:!text-white hover:!border-primary-hover',
    },
  ],
  defaultVariants: {
    color: EButtonColor.PRIMARY,
    variant: EButtonVariant.SOLID,
  },
})