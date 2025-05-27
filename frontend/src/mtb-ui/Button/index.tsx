import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd'
import { useMemo } from 'react'
import { IButtonProps } from '@app/types/Button.types'
import { EButtonColor, EButtonVariant } from '@app/enums/button.enum'

const Button = (
  props: IButtonProps & Omit<AntdButtonProps, 'color' | 'type'>
) => {
  const {
    color = EButtonColor.PRIMARY,
    variant = EButtonVariant.SOLID,
    customClassName,
    children,
    ...rest
  } = props

  const customColorClass: Record<EButtonColor, string> = {
    [EButtonColor.PRIMARY]: `!bg-primary-default hover:!bg-primary-hover active:!bg-primary-active 
      !text-white !border-primary-border hover:!border-primary-hover active:!border-primary-active 
      disabled:!bg-gray-300 disabled:!border-gray-400 disabled:!text-gray-500 disabled:!cursor-not-allowed`,
    [EButtonColor.SECONDARY]: `
      !bg-white !text-black !border-gray-300 
      hover:!bg-gray-100 active:!bg-gray-200 
      disabled:!bg-gray-100 disabled:!border-gray-200 disabled:!text-gray-400 disabled:!cursor-not-allowed
    `,
    [EButtonColor.DEFAULT]: '',
    [EButtonColor.DANGER]: '',
    [EButtonColor.PINK]: '',
    [EButtonColor.PURPLE]: '',
    [EButtonColor.CYAN]: '',
  }

  const useCustomClassOnly = color === EButtonColor.PRIMARY || color === EButtonColor.DARK

  const _className = useMemo(() => {
    const baseClass = useCustomClassOnly ? customColorClass[color] : ''
    return `${baseClass} ${customClassName || ''}`.trim()
  }, [color, customClassName])

  return (
    <AntdButton
      {...(useCustomClassOnly ? {} : { color, variant })}
      className={_className}
      {...rest}
    >
      {children}
    </AntdButton>
  )
}

export default Button
