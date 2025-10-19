import { Button, Form, Input, InputNumber, Modal, TimePicker } from 'antd'
import {  useState } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import Checkbox from '@app/pages/AdminPage/AdminManageMailSchedule/components/Checkbox'
import RepeatUnitSelect from '@app/pages/AdminPage/AdminManageMailSchedule/components/Select'
import { RepeatUnit } from '@app/enums/subscribe'
import { useSubscribeControllerCreateSubscriberMutation } from '@app/services/api/subscribe/subscribe'
import { useMailControllerGetAllMailsQuery } from '@app/services/api/mail/mail'

export interface SubscriberFormValues {
  email: string
  isRepeatable: boolean
  repeatEvery: number
  repeatUnit: RepeatUnit
  sendTime: string
}

interface CreateSubscriberProps {
  open: boolean
  onClose: () => void
}

const CreateSubscriberModal = ({ open, onClose }: CreateSubscriberProps) => {
  const [createSubscriber, { isLoading }] = useSubscribeControllerCreateSubscriberMutation()
  const { refetch } = useMailControllerGetAllMailsQuery()
  const [form] = Form.useForm<SubscriberFormValues>()
  const [checked, setChecked] = useState(false);
  const [unit, setUnit] = useState<RepeatUnit | undefined>();

   const handleSendMail = async () => {
    try {
      const subValues = form.getFieldsValue();
      const res = await createSubscriber({
        ...subValues,
        sendTime: subValues.sendTime ? dayjs(subValues.sendTime).format('HH:mm:ss') : undefined,
      }).unwrap()
      if(res.statusCode === 200) {
        onClose()
        form.resetFields()
        refetch()
        toast.success('Subscriber created successfully')
      }
    } catch (e) {
      toast.error('Send mail failed')
    }
  }

 
  return (
   <Modal
      title="Create Mail Schedule"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="send" type="primary" onClick={handleSendMail} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Subscriber'}
        </Button>,
      ]}
      width={700}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="max-w-full">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="isRepeatable" label="Repeat">
              <Checkbox 
                checked={checked}
                onChange={setChecked} 
              />
          </Form.Item>
          {checked && (
            <Form.Item name="sendTime" label="Send time">
              <TimePicker format="HH:mm:ss"/>
            </Form.Item>
          )}
          {checked && (
            <Form.Item name="repeatEvery" label="Repeat every">
             <InputNumber min={1} />
            </Form.Item>
          )}
          {checked && (
            <Form.Item name="repeatUnit" label="Repeat unit">
             <RepeatUnitSelect value={unit} onChange={setUnit} />
          </Form.Item>
          )}
          
        </Form>
      </div>
    </Modal>
  )
}

export default CreateSubscriberModal
