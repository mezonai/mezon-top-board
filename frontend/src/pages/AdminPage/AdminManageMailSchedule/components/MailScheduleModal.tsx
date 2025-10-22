import { Button, Form, Input, Modal, Select, TimePicker } from 'antd'
import RichTextEditor from '@app/components/RichText/RichText'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { RepeatInterval } from '@app/enums/subscribe'
import Checkbox from 'antd/es/checkbox/Checkbox'
import dayjs from 'dayjs';
import { MailTemplate, useMailTemplateControllerCreateAndSendMailMutation, useMailTemplateControllerUpdateMailMutation } from '@app/services/api/mailTemplate/mailTemplate'

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
  const [createMailSchedule, { isLoading }] = useMailTemplateControllerCreateAndSendMailMutation()
  const [updateMailSchedule] = useMailTemplateControllerUpdateMailMutation()
  const [form] = Form.useForm<MailFormValues>()
  const [checked, setChecked] = useState(false);
  const [intervalMode, setIntervalMode] = useState<RepeatInterval>();

  const handleCreateMailSchedule = async () => {
    try {
      const mailValues = form.getFieldsValue();
      const sendMailResponse = await createMailSchedule({
        createMailRequest: { ...mailValues, isRepeatable: checked, repeatInterval: intervalMode }
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
  }

  useEffect(() => {
    if (selectMail) {
      form.setFieldsValue({
        ...selectMail,
        scheduledAt: dayjs(selectMail.scheduledAt),
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
        <Button key="cancel" onClick={handleCancel}>
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
              //minuteStep={30}
              defaultValue={dayjs('08:00', 'HH:mm')}
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
