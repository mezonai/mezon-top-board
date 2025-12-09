import { TypographyVariant } from '@app/enums/typography.enum'
import { AntdTypographyComponent, levelTitle, MtbTypographyProps } from './Typography.types'
import { ConfigProvider, Typography } from 'antd'
import { useMemo } from 'react'
import { cn } from '@app/utils/cn'
import { typographyClasses } from './Typography.styles'

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

  const { Component } = levelMap[variant]

  const TypographyStyle = useMemo(() => ({ ...style, fontSize: size ? `${size}px` : undefined }), [style, size])
  const computedClassName = cn(typographyClasses({ variant: variant as any, weight: weight as any }), customClassName, ...(textStyle || []))

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
        className={computedClassName}
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
