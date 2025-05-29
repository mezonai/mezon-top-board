import { TypographyVariant, TypographyWeight } from '@app/enums/typography.enum'
import { AntdTypographyComponent, levelTitle, MtbTypographyProps } from './Typography.types'
import { ConfigProvider, Typography } from 'antd'
import { useMemo } from 'react'

function MtbTypography({
  variant = 'h1',
  children,
  label,
  weight,
  textStyle = [],
  position = 'left',
  customClassName = '',
  size,
  style = {},
  ellipsis = false
}: MtbTypographyProps) {
  const levelMap: Record<TypographyVariant, { Component: AntdTypographyComponent; className: string }> = {
    [TypographyVariant.H1]: { Component: Typography.Title, className: 'text-3xl' },
    [TypographyVariant.H2]: { Component: Typography.Title, className: 'text-2xl' },
    [TypographyVariant.H3]: { Component: Typography.Title, className: 'text-xl' },
    [TypographyVariant.H4]: { Component: Typography.Title, className: 'text-lg' },
    [TypographyVariant.H5]: { Component: Typography.Title, className: 'text-sm' },
    [TypographyVariant.P]: { Component: Typography.Text, className: 'text-md' }
  }

  const { Component, className: fontSize } = levelMap[variant]

  const weightClasses: Record<string, string> = {
    [TypographyWeight.BOLD]: '!font-bold',
    [TypographyWeight.NORMAL]: '!font-normal',
    [TypographyWeight.ITALIC]: '!italic',
    [TypographyWeight.SEMIBOLD]: '!font-semibold',
    [TypographyWeight.LIGHT]: '!font-light',
    [TypographyWeight.EXTRABOLD]: '!font-extrabold'
  }

  const fontWeight = useMemo(() => {
    return weight
      ? weightClasses[weight]
      : variant === TypographyVariant.P
        ? weightClasses[TypographyWeight.NORMAL]
        : weightClasses[TypographyWeight.BOLD]
  }, [weight, variant])

  const TypographyStyle = useMemo(() => ({ ...style, fontSize: size ? `${size}px` : undefined }), [style, size])

  return (
    <ConfigProvider
      theme={{
        components: {
          Typography: {
            titleMarginBottom: 8,
            titleMarginTop: 8
          }
        },
        token: {
          fontFamily: 'Open Sans, sans-serif',
        }
      }}
    >
      <Component
        level={variant !== TypographyVariant.P ? (parseInt(variant.replace('h', ''), 10) as levelTitle) : undefined}
        className={['flex items-center', fontSize, fontWeight, customClassName, ...textStyle]
          .filter(Boolean)
          .join(' ')}
        style={TypographyStyle}
        ellipsis={ellipsis}
      >
        {label && position === 'left' && <span className='mr-2 align-middle'>{label}</span>}
        {children}
        {label && position === 'right' && <span className='ml-2 align-middle'>{label}</span>}
      </Component>
    </ConfigProvider>
  )
}

export default MtbTypography
