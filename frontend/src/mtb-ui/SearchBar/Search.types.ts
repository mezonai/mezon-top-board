import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AutoCompleteProps } from 'antd'

export interface ISearchBarProps extends Omit<AutoCompleteProps, 'onSearch' | 'options'> {
  placeholder?: string
  allowClear?: boolean
  onSearch: (value?: string, tags?: string[], type?: MezonAppType | '') => void
  debounceTime?: number
  data?: string[],
  isShowButton?: boolean
  isResultPage?: boolean
}
