import { Button, Form, Input, InputNumber, Modal, TimePicker } from 'antd'
import RichTextEditor from '@app/components/RichText/RichText'
import { useMailControllerCreateAndSendMailMutation, useMailControllerGetAllMailsQuery } from '@app/services/api/mail/mail'
import { useState } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import Checkbox from '@app/pages/AdminPage/AdminManageMailSchedule/components/Checkbox'
import RepeatUnitSelect from '@app/pages/AdminPage/AdminManageMailSchedule/components/Select'
import { RepeatUnit } from '@app/enums/subscribe'

export interface MailFormValues {
  title: string,
  subject: string,
  content: string,
  isRepeatable: boolean
  repeatEvery: number
  repeatUnit: RepeatUnit
  sendTime: string
}

interface CreateMailModalProps {
  open: boolean
  onClose: () => void
}

const CreateMailModal = ({ open, onClose }: CreateMailModalProps) => {
  const [createAndSendMail, {isLoading}] = useMailControllerCreateAndSendMailMutation()
  const { refetch } = useMailControllerGetAllMailsQuery()
  const [form] = Form.useForm<MailFormValues>()
  const [checked, setChecked] = useState(false);
  const [unit, setUnit] = useState<RepeatUnit | undefined>();

   const handleSendMail = async () => {
    try {
      const mailValues = form.getFieldsValue();
       const sendMailResponse = await createAndSendMail({
          createMailRequest: {
            ...mailValues,
            sendTime: mailValues.isRepeatable 
            ? dayjs(mailValues.sendTime).format('HH:mm:ss') 
            : undefined,
          }
        })
        if(sendMailResponse.data?.statusCode !== 200){
          onClose()
          toast.error('Send mail failed')
        }else{
          onClose()
          refetch()
          form.resetFields()
          toast.success('Mail sent successfully')
        }
    } catch (e) {
      console.error('Send mail failed', e)
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
          {form.getFieldValue('isRepeatable') ? 'Create Schedule' : 'Send Now'}
        </Button>,
      ]}
      width={700}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="max-w-full">
          <Form.Item name="title" label="Title" rules={[
            { required: true, message: "Title is required" },
            { min: 3, message: "Title must be at least 3 characters" },
            { max: 128, message: "Title must not exceed 128 characters" },
          ]}>
            <Input />
          </Form.Item>
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
          <Form.Item name="content" label="Content">
              <RichTextEditor customClass="custom-editor" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default CreateMailModal
