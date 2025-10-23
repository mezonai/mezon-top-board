import * as React from 'react';
import type { PickerProps } from 'antd/es/date-picker/generatePicker';
import type { Moment } from 'moment';
import MyDatePicker from '@app/pages/AdminPage/AdminManageMailSchedule/components/DatePicker';

export interface TimePickerProps extends Omit<PickerProps<Moment>, 'picker'> {}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => (
  <MyDatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

TimePicker.displayName = 'TimePicker';

export default TimePicker;