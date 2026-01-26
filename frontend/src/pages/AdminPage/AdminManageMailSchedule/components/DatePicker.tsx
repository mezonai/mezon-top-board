import momentGenerateConfig from '@rc-component/picker/es/generate/moment';
import { DatePicker } from 'antd';
import type { Moment } from 'moment';

const MyDatePicker = DatePicker.generatePicker<Moment>(momentGenerateConfig);

export default MyDatePicker;