import { Select as AntSelect, SelectProps } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

export interface IOption {
  value: string | number
  label?: ReactNode
}

interface ISelectProps {
  options: IOption[]
  dropDownTitle?: string
}

const SingleSelect = (props: ISelectProps & SelectProps<IOption>) => {
  const { options, dropDownTitle, ...rest } = props

  const [selectedValue, setSelectedValue] = useState(props.defaultValue ?? (options[0] as IOption))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (props.value) {
      setSelectedValue(props.value)
    }
  }, [props.value])

  const handleChange = useCallback((option: IOption) => {
    setSelectedValue(option)
    props.onChange?.(option)
    setOpen(false)
  },
  [props.onChange])

  const _className = useMemo(() => {
    return `text-base font-medium rounded-lg ${props.className} `
  }, [props.className])

  return (
    <AntSelect
      value={selectedValue}
      labelInValue={true}
      open={open}
      onDropdownVisibleChange={(visible) => setOpen(visible)}
      title=''
      className={_className}
      dropdownRender={() => (
        <div className='p-2' style={{ background: 'var(--bg-container)', color: 'var(--text-primary)' }}>
          <div className='text-xs pb-2 uppercase' style={{ color: 'var(--text-secondary)' }}>{dropDownTitle}</div>
          {options.map((option) => {
            const isSelected = selectedValue?.value === option.value
            return (
              <div
                key={option.value}
                onClick={() => handleChange(option)}
                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--bg-container-secondary)]`}
                style={{ background: isSelected ? 'var(--bg-container-secondary)' : 'transparent', color: 'var(--text-primary)' }}
              >
                <span className='text-base' style={{ color: 'var(--text-primary)' }}>{option.label}</span>
                {isSelected && <CheckOutlined className='!text-[var(--text-primary)]' />}
              </div>
            )
          })}
        </div>
      )}
      options={options.map((item) => ({ label: item.label, value: item.value }))}
      variant='borderless'
      style={{
        background: 'var(--bg-container)',
        borderRadius: 10,
        height: '3rem',
        border: '1px solid var(--border-color)'
      }}
      {...rest}
    />
  )
}

export default SingleSelect
