import { Checkbox, Form, Input, Modal, Select, Space } from 'antd'
import Button from '@app/mtb-ui/Button'
import RichTextEditor from '@app/components/RichText/RichText'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { RepeatInterval } from '@app/enums/subscribe'
import TimePicker from '@app/pages/AdminPage/AdminManageMailSchedule/components/TimePicker'
import moment from 'moment'
import { useMailTemplateControllerCreateMailMutation, useMailTemplateControllerUpdateMailMutation } from '@app/services/api/marketingMail/marketingMail'
import { MailTemplate } from '@app/types'
import DateTimePicker from '@app/pages/AdminPage/AdminManageMailSchedule/components/DateTimePicker'

export interface MailFormValues {
  subject: string,
  content: string,
  isRepeatable: boolean
  repeatInterval?: RepeatInterval
  scheduledDate: moment.Moment
  scheduledTime: moment.Moment
}

interface MailModalProps {
  open: boolean
  onClose: () => void
  selectMail?: MailTemplate
  refetch: () => Promise<void>
}

const MailScheduleModal = ({ open, onClose, selectMail, refetch }: MailModalProps) => {
  const [createMailSchedule, { isLoading }] = useMailTemplateControllerCreateMailMutation()
  const [updateMailSchedule] = useMailTemplateControllerUpdateMailMutation()
  const [form] = Form.useForm<MailFormValues>()
  const scheduledDate = Form.useWatch('scheduledDate', form);
  const [checked, setChecked] = useState(false);
  const [intervalMode, setIntervalMode] = useState<RepeatInterval>();

  const getInitialTimeFromNow = (step = 30) => {
    const now = moment();
    const minutes = now.minute();

    const roundedMinutes = Math.ceil(minutes / step) * step;

    return now
      .clone()
      .minute(roundedMinutes)
      .second(0)
      .millisecond(0);
  };

  const disabledHours = () => {
    if (!scheduledDate) return [];

    if (!scheduledDate.isSame(moment(), 'day')) return [];

    const currentHour = moment().hour();
    return Array.from({ length: currentHour }, (_, i) => i);
  };

  const disabledMinutes = (selectedHour: number) => {
    if (!scheduledDate) return [];

    if (!scheduledDate.isSame(moment(), 'day')) return [];

    const now = moment();
    const currentHour = now.hour();
    const currentMinute = now.minute();

    if (selectedHour === currentHour) {
      return Array.from({ length: currentMinute }, (_, i) => i);
    }

    return [];
  };

  const handleDateChange = (date: moment.Moment | null) => {
    if (!date) return;

    const now = moment();
    const isToday = date.isSame(now, 'day');

    if (!date.isSame(moment(), 'day')) {
      form.setFieldsValue({
        scheduledTime: moment('08:00', 'HH:mm'),
      });
    }

    if (isToday) {
      form.setFieldsValue({
        scheduledTime: getInitialTimeFromNow(30),
      });
    }
  };

  const handleCreateMailSchedule = async () => {
    try {
      const mailValues = form.getFieldsValue();

      const { scheduledDate, scheduledTime, ...rest } = mailValues;

      const scheduledAt = moment(scheduledDate)
        .set({
          hour: scheduledTime.hour(),
          minute: scheduledTime.minute(),
          second: 0,
          millisecond: 0,
        })
        .toDate();
      const sendMailResponse = await createMailSchedule({
        createMailTemplateRequest: { ...rest, isRepeatable: checked, repeatInterval: intervalMode ? intervalMode : undefined, scheduledAt }
      })
      if (sendMailResponse.data?.statusCode !== 200) {
        onClose()
        toast.error('Mail schedule created failed')

      } else {
        onClose()
        await refetch()
        form.resetFields()
        toast.success('Mail schedule created successfully')
      }
    } catch (e) {
      console.error('Mail schedule creation failed', e)
    }
  }

  const handleUpdateMailSchedule = async () => {
    try {
      const mailValues = form.getFieldsValue();

      const { scheduledDate, scheduledTime, ...rest } = mailValues;

      const scheduledAt = moment(scheduledDate)
        .set({
          hour: scheduledTime.hour(),
          minute: scheduledTime.minute(),
          second: 0,
          millisecond: 0,
        })
        .toDate();

      const sendMailResponse = await updateMailSchedule({
        id: selectMail?.id || '',
        updateMailRequest: { ...rest, isRepeatable: checked, repeatInterval: intervalMode, scheduledAt }
      })
      if (sendMailResponse.data?.statusCode !== 200) {
        onClose()
        toast.error('updated failed')
      } else {
        onClose()
        await refetch()
        form.resetFields()
        toast.success('updated successfully')
      }
    } catch (e) {
      console.error('updated failed', e)
    }
  }

  const handleCancel = () => {
    onClose()
    form.resetFields()
    setChecked(false);
    setIntervalMode(undefined);
  }

  useEffect(() => {
    if (selectMail) {
      const m = moment(selectMail.scheduledAt);

      form.setFieldsValue({
        ...selectMail,
        scheduledDate: m,
        scheduledTime: m,
      });

      setChecked(!!selectMail.isRepeatable);
      setIntervalMode(selectMail.repeatInterval);
    }
  }, [selectMail]);

  return (
    <Modal
      title="Create Mail Schedule"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" variant='outlined' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="send" type="primary" onClick={selectMail ? handleUpdateMailSchedule : handleCreateMailSchedule} disabled={isLoading}>
          {selectMail
            ? 'Update Schedule'
            : 'Create Schedule'}
        </Button>,
      ]}
      width={700}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          className="max-w-full"
          initialValues={{
            scheduledDate: moment(),
            scheduledTime: getInitialTimeFromNow(30),
          }}
        >
          <Form.Item name="subject" label="Subject" rules={[
            () => ({
              validator(_, value) {
                if (!value || value.length < 10) return Promise.reject("Subject must be at least 10 characters");
                if (value.length > 100) return Promise.reject("Subject must not exceed 100 characters");
                return Promise.resolve();
              },
            }),
          ]}>
            <Input />
          </Form.Item>
          <Form.Item name="scheduledAt" label="Schedule At" required>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name="scheduledTime"
                noStyle
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <TimePicker
                  format="HH:mm"
                  minuteStep={30}
                  style={{ width: '40%' }}
                  disabledHours={disabledHours}
                  disabledMinutes={disabledMinutes}
                />
              </Form.Item>
              <Form.Item
                name="scheduledDate"
                noStyle
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DateTimePicker
                  format="YYYY-MM-DD"
                  style={{ width: '60%' }}
                  onChange={handleDateChange}
                  disabledDate={(current) =>
                    current && current < moment().startOf('day')
                  }
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item name="isRepeatable" label="Repeat">
            <Checkbox checked={checked} onChange={(e) => {
              setChecked(e.target.checked);
              form.setFieldsValue({ isRepeatable: e.target.checked });
            }} />
          </Form.Item>
          {checked && (
            <Form.Item name="repeatInterval" label="Repeat interval">
              <Select
                placeholder="Select interval"
                onChange={setIntervalMode}
                value={intervalMode}
              >
                {Object.values(RepeatInterval).map((interval) => (
                  <Select.Option key={interval} value={interval}>
                    {interval.charAt(0) + interval.slice(1).toLowerCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item name="content" label="Content">
            <RichTextEditor customClass="custom-editor" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default MailScheduleModal
