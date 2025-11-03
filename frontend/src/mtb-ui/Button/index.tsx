import { Button as AntdButton } from 'antd'
import { ConfigProvider } from 'antd'
import { FC } from 'react'
import { IButtonProps } from './Button.types'
import { TinyColor } from '@ctrl/tinycolor'

const MtbButton: FC<IButtonProps> = ({
  customClassName = '',
  variant = 'solid',
  color ='primary',
  ...rest
}) => {
  const getDefaultOutlinedHoverClass = () => {
    if (color === 'default' && variant === 'outlined') {
      return 'hover:!bg-black hover:!text-white hover:!border-black'
    } else if (color === 'primary' && variant === 'outlined') {
      return 'hover:!bg-primary-hover hover:!text-white hover:!border-primary-hover'
    }
    return ''
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: '#F2385A',
            colorPrimaryBorder: new TinyColor('#F2385A').setAlpha(0.2).toString(),
            colorPrimaryHover: new TinyColor('#F2385A').setAlpha(5).toString(),
            colorPrimaryTextHover: new TinyColor('#F2385A').setAlpha(5).toString(),
            colorPrimaryBgHover: new TinyColor('#F2385A').setAlpha(5).toString(),
            colorPrimaryActive: new TinyColor('#F2385A').lighten(10).toString(),
            colorPrimaryTextActive:  new TinyColor('#F2385A').lighten(10).toString(),
          }
        }
      }}
    >
      <AntdButton
        color={color}
        variant={variant}
        className={`${getDefaultOutlinedHoverClass()} ${customClassName}`.trim()}
        {...rest}
      >
      </AntdButton>
    </ConfigProvider>
  )
}

export default MtbButton