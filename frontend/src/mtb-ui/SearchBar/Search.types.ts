import { AutoCompleteProps } from 'antd'

export interface ISearchBarProps extends Omit<AutoCompleteProps, 'onSearch' | 'options'> {
  placeholder?: string
  allowClear?: boolean
  onSearch: (value?: string, tags?: string[]) => void
  debounceTime?: number
  data?: string[],
  isShowButton?: boolean
  isResultPage?: boolean
}
