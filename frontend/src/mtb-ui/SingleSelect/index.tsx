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
        <div className='p-2'>
          <div className='text-xs pb-2 uppercase'>{dropDownTitle}</div>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleChange(option)}
              className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                selectedValue.value === option.value ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <span className='text-base'>{option.label}</span>
              {selectedValue.value === option.value && <CheckOutlined className='text-black' />}
            </div>
          ))}
        </div>
      )}
      options={options.map((item) => ({ label: item.label, value: item.value }))}
      variant='borderless'
      style={{
        background: '#f6f8f7',
        borderRadius: 10,
        height: '3rem'
      }}
      {...rest}
    />
  )
}

export default SingleSelect
