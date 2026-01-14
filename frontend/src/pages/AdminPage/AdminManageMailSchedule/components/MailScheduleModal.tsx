import { Checkbox, Form, Input, Modal, Select } from 'antd'
import Button from '@app/mtb-ui/Button'
import RichTextEditor from '@app/components/RichText/RichText'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { RepeatInterval } from '@app/enums/subscribe'
import moment from 'moment'
import { useMailTemplateControllerCreateMailMutation, useMailTemplateControllerUpdateMailMutation } from '@app/services/api/marketingMail/marketingMail'
import { MailTemplate } from '@app/types'
import DatePicker from '@app/pages/AdminPage/AdminManageMailSchedule/components/DatePicker'

export interface MailFormValues {
  subject: string,
  content: string,
  isRepeatable: boolean
  repeatInterval?: RepeatInterval
  scheduledAt: moment.Moment
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
  const [checked, setChecked] = useState(false);
  const [intervalMode, setIntervalMode] = useState<RepeatInterval>();
  const now = moment();

  const roundedUpTo30 = moment(now)
    .add(30 - (now.minute() % 30), 'minutes')
    .startOf('minute')
    .second(0)
    .millisecond(0);

  const handleCreateMailSchedule = async () => {
    const { scheduledAt, ...rest } = form.getFieldsValue()

    const res = await createMailSchedule({
      createMailTemplateRequest: {
        ...rest,
        isRepeatable: checked,
        repeatInterval: intervalMode,
        scheduledAt: scheduledAt.toDate(),
      },
    })

    if (res.data?.statusCode === 200) {
      onClose()
      await refetch()
      form.resetFields()
      toast.success('Mail schedule created successfully')
    } else {
      toast.error('Mail schedule created failed')
    }
  }

  const handleUpdateMailSchedule = async () => {
    const { scheduledAt, ...rest } = form.getFieldsValue()

    const res = await updateMailSchedule({
      id: selectMail?.id || '',
      updateMailRequest: {
        ...rest,
        isRepeatable: checked,
        repeatInterval: intervalMode,
        scheduledAt: scheduledAt.toDate(),
      },
    })

    if (res.data?.statusCode === 200) {
      onClose()
      await refetch()
      form.resetFields()
      toast.success('updated successfully')
    } else {
      toast.error('updated failed')
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
      form.setFieldsValue({
        ...selectMail,
        scheduledAt: moment(selectMail.scheduledAt),
      })
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
            scheduledAt: roundedUpTo30
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
          <Form.Item
            name="scheduledAt"
            label="Schedule At"
            rules={[{ required: true, message: 'Please select date & time' }]}
          >
            <DatePicker
              showTime={{
                format: 'HH:mm',
                minuteStep: 30,
              }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '80%' }}
              disabledDate={(current) =>
                current && current < moment().startOf('day')
              }
              disabledTime={(current) => {
                if (!current) return {}

                const now = moment()
                if (!current.isSame(now, 'day')) return {}

                return {
                  disabledHours: () =>
                    Array.from({ length: now.hour() }, (_, i) => i),
                  disabledMinutes: (hour) =>
                    hour === now.hour()
                      ? Array.from({ length: now.minute() }, (_, i) => i)
                      : [],
                }
              }}
            />
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
