import { Select as AntSelect, SelectProps } from 'antd'
import { CheckOutlined, DownOutlined } from '@ant-design/icons'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import styles from './SingleSelect.module.scss'

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
    return `text-base font-medium ${styles.singleSelect} ${props.className} `
  }, [props.className])

  return (
    <AntSelect
      value={selectedValue}
      labelInValue={true}
      open={open}
      onDropdownVisibleChange={(visible) => setOpen(visible)}
      title=''
      className={_className}
      popupClassName={styles.popupReset}  
      suffixIcon={<DownOutlined className={styles.arrowIcon} />}
      dropdownRender={() => (
        <div className={styles.dropdown}>
          {dropDownTitle && <div className={styles.dropdownTitle}>{dropDownTitle}</div>}
          {options.map((option) => {
            const isSelected = selectedValue?.value === option.value
            return (
              <div
                key={option.value}
                onClick={() => handleChange(option)}
                className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              >
                <span className={styles.optionLabel}>{option.label}</span>
                {isSelected && <CheckOutlined className={styles.checkIcon} />}
              </div>
            )
          })}
        </div>
      )}
      options={options.map((item) => ({ label: item.label, value: item.value }))}
      variant='filled'
      {...rest}
    />
  )
}

export default SingleSelect
