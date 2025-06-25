import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd'
import { useMemo } from 'react'
import { IButtonProps } from './Button.types'
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

  const customColorClass: Record<EButtonColor, Partial<Record<EButtonVariant, string>>> = {
    [EButtonColor.PRIMARY]: {
      [EButtonVariant.SOLID]: `
        !bg-primary-default hover:!bg-primary-hover active:!bg-primary-active 
        !text-white !border-primary-border hover:!border-primary-hover active:!border-primary-active 
        disabled:!bg-gray-300 disabled:!border-gray-400 disabled:!text-gray-500 disabled:!cursor-not-allowed
      `,
      [EButtonVariant.OUTLINED]: `
        !bg-white !text-primary-default !border-primary-default
        hover:!bg-primary-hover hover:!text-white hover:!border-primary-hover
        active:!bg-primary-active active:!text-white active:!border-primary-active
        disabled:!bg-gray-100 disabled:!border-gray-200 disabled:!text-gray-400 disabled:!cursor-not-allowed
      `
    },
    [EButtonColor.SECONDARY]: {
      [EButtonVariant.SOLID]: `!bg-[#1677ff] hover:!bg-[#4096ff] active:!bg-[#0958d9]
      !text-white !border-[#1677ff] hover:!border-[#4096ff] active:!border-[#0958d9]
      disabled:!bg-gray-300 disabled:!border-gray-400 disabled:!text-gray-500 disabled:!cursor-not-allowed`
    },
    [EButtonColor.DARK]: {
      [EButtonVariant.SOLID]:` !bg-transparent !text-gray-800 !border-gray-300
        hover:!bg-gray-900 hover:!text-white hover:!border-gray-900
        active:!bg-black active:!border-black active:!text-white
        disabled:!bg-gray-100 disabled:!border-gray-200 disabled:!text-gray-400 disabled:!cursor-not-allowed`
      },
    [EButtonColor.DEFAULT]: {[EButtonVariant.SOLID]:''},
    [EButtonColor.DANGER]: {[EButtonVariant.SOLID]:''},
    [EButtonColor.PINK]: {[EButtonVariant.SOLID]:''},
    [EButtonColor.PURPLE]: {[EButtonVariant.SOLID]:''},
    [EButtonColor.CYAN]: {[EButtonVariant.SOLID]:''},
  }

  const useCustomClassOnly =
    (color === EButtonColor.PRIMARY || color === EButtonColor.SECONDARY || color === EButtonColor.DARK)
    && (variant === EButtonVariant.SOLID || variant === EButtonVariant.OUTLINED)

  const _className = useMemo(() => {
  const baseClass = useCustomClassOnly ? customColorClass[color]?.[variant] ?? '' : ''
    return `${baseClass} ${customClassName || ''}`.trim()
  }, [color, variant, customClassName])

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
