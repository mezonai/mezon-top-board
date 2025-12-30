import { FC, useMemo } from 'react'
import { Button as AntdButton, ConfigProvider } from 'antd'
import { cn } from '@app/utils/cn'
import { EButtonColor, EButtonVariant } from '@app/enums/button.enum'
import { IButtonProps } from './Button.types'
import { buttonVariants, getButtonTheme } from './Button.styles'

const MtbButton: FC<IButtonProps> = ({
  customClassName = '',
  variant = EButtonVariant.SOLID,
  color = EButtonColor.PRIMARY,
  className,
  ...rest
}) => {
  const colorMap: Record<string, EButtonColor> = {
    default: EButtonColor.DEFAULT,
    primary: EButtonColor.PRIMARY,
    danger: EButtonColor.DANGER,
    pink: EButtonColor.PINK,
    purple: EButtonColor.PURPLE,
    cyan: EButtonColor.CYAN,
    blue: EButtonColor.BLUE,
  }

  const variantMap: Record<string, EButtonVariant> = {
    outlined: EButtonVariant.OUTLINED,
    dashed: EButtonVariant.DASHED,
    filled: EButtonVariant.FILLED,
    text: EButtonVariant.TEXT,
    link: EButtonVariant.LINK,
    solid: EButtonVariant.SOLID,
  }

  const normalizedColor = colorMap[String(color).toLowerCase()] ?? EButtonColor.PRIMARY
  const normalizedVariant = variantMap[String(variant).toLowerCase()] ?? EButtonVariant.SOLID
  const themeConfig = useMemo(() => getButtonTheme(), [])

  return (
    <ConfigProvider theme={themeConfig}>
      <AntdButton
        color={normalizedColor}
        variant={normalizedVariant}
        className={cn(buttonVariants({ color: normalizedColor, variant: normalizedVariant }), customClassName, className)}
        {...rest}
      />
    </ConfigProvider>
  )
}

export default MtbButton