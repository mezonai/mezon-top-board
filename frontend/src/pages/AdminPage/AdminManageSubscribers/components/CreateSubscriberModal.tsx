import { Button, Form, Input, Modal } from 'antd'
import { toast } from 'react-toastify'
import { useSubscribeControllerCreateSubscriberMutation, useSubscribeControllerGetAllSubscriberQuery } from '@app/services/api/subscribe/subscribe'
export interface SubscriberFormValues {
  email: string
}

interface CreateSubscriberProps {
  open: boolean
  onClose: () => void
}

const CreateSubscriberModal = ({ open, onClose }: CreateSubscriberProps) => {
  const [createSubscriber, { isLoading }] = useSubscribeControllerCreateSubscriberMutation()
  const { refetch } = useSubscribeControllerGetAllSubscriberQuery()
  const [form] = Form.useForm<SubscriberFormValues>()

  const handleCreate = async () => {
    try {
      const subValues = form.getFieldsValue();
      const res = await createSubscriber(subValues).unwrap()
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
        <Button key="send" type="primary" onClick={handleCreate} disabled={isLoading}>
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
        </Form>
      </div>
    </Modal>
  )
}

export default CreateSubscriberModal
