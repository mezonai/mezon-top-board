import generatePicker from 'antd/es/date-picker/generatePicker'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'
import type { Moment } from 'moment'

const DatePicker = generatePicker<Moment>(momentGenerateConfig)

export default DatePicker