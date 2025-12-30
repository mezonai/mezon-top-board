import { Checkbox, Form, Input, Modal, Select } from 'antd'
import Button from '@app/mtb-ui/Button'
import RichTextEditor from '@app/components/RichText/RichText'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { RepeatInterval } from '@app/enums/subscribe'
import TimePicker from '@app/pages/AdminPage/AdminManageMailSchedule/components/TimePicker'
import moment from 'moment'
import { useMailTemplateControllerCreateMailMutation, useMailTemplateControllerUpdateMailMutation } from '@app/services/api/marketingMail/marketingMail'
import { MailTemplate } from '@app/types'

export interface MailFormValues {
  subject: string,
  content: string,
  isRepeatable: boolean
  repeatInterval?: RepeatInterval
  scheduledAt: Date
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

  const now = moment()

  const disabledHours = () => {
    if (selectMail !== undefined && checked) return []
    const currentHour = now.hour()
    return Array.from({ length: currentHour }, (_, i) => i)
  }

  const disabledMinutes = (selectedHour: number) => {
    if (selectMail !== undefined && checked) return []
    const currentHour = now.hour()
    const currentMinute = now.minute()
    if (selectedHour === currentHour) {
      return Array.from({ length: currentMinute }, (_, i) => i)
    }
    return []
  }

  const handleCreateMailSchedule = async () => {
    try {
      const mailValues = form.getFieldsValue();
      const sendMailResponse = await createMailSchedule({
        createMailTemplateRequest: { ...mailValues, isRepeatable: checked, repeatInterval: intervalMode ? intervalMode : undefined }
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
      const sendMailResponse = await updateMailSchedule({
        id: selectMail?.id || '',
        updateMailRequest: { ...mailValues, isRepeatable: checked, repeatInterval: intervalMode }
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
      form.setFieldsValue({
        ...selectMail,
        scheduledAt: moment(selectMail.scheduledAt),
      })
      setChecked(!!selectMail.isRepeatable);
      setIntervalMode(selectMail.repeatInterval);
    }
  }, [selectMail])

  return (
    <Modal
      title="Create Mail Schedule"
      open={open}
      onCancel={onClose}
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
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="max-w-full">
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
          <Form.Item name="scheduledAt" label="Schedule time">
            <TimePicker
              format="HH:mm"
              minuteStep={30}
              defaultValue={moment('08:00', 'HH:mm')}
              disabledHours={!checked ? disabledHours : undefined}
              disabledMinutes={!checked ? disabledMinutes : undefined}
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
