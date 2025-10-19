import { Button, Form, Input, InputNumber, Modal, TimePicker } from 'antd'
import RichTextEditor from '@app/components/RichText/RichText'
import { useMailControllerCreateAndSendMailMutation, useMailControllerCreateMailMutation } from '@app/services/api/mail/mail'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import Checkbox from '@app/pages/AdminPage/AdminManageMailSchedule/components/Checkbox'
import RepeatUnitSelect from '@app/pages/AdminPage/AdminManageMailSchedule/components/Select'
import { RepeatUnit } from '@app/enums/subscribe'
import { useSubscribeControllerGetAllActiveSubscriberQuery, useSubscribeControllerUpdateScheduleMutation } from '@app/services/api/subscribe/subscribe'

export interface MailFormValues {
  title: string,
  subject: string,
  content: string,
  subscriberIds: string[]
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
  const [createMail, { isLoading }] = useMailControllerCreateMailMutation()
  const [createAndSendMail] = useMailControllerCreateAndSendMailMutation()
  const [updatePreferences] = useSubscribeControllerUpdateScheduleMutation()
  const { data: subscriberData } = useSubscribeControllerGetAllActiveSubscriberQuery()
  const [form] = Form.useForm<MailFormValues>()
  const [subscriberIds, setSubscriberIds] = useState<string[]>([])
  const [checked, setChecked] = useState(false);
  const [unit, setUnit] = useState<RepeatUnit | undefined>();

  const handleRemoveSubscriber = (id: string) => {
     setSubscriberIds(prev => prev.filter(subId => subId !== id))
  }   

  useEffect(() => {
    if (subscriberData) {
      setSubscriberIds(subscriberData.data.map(s => s.id))
    }
  }, [subscriberData])

   const handleSendMail = async () => {
    try {
      const mailValues = form.getFieldsValue(['title', 'subject', 'content']);
      const subValues = form.getFieldsValue(['isRepeatable', 'repeatEvery', 'repeatUnit', 'sendTime']);
      if(subValues.isRepeatable){
        for(const subId of subscriberIds){ 
          await updatePreferences({
            id: subId,
            isRepeatable: subValues.isRepeatable,
            repeatEvery: subValues.repeatEvery || 1,
            repeatUnit: subValues.repeatUnit || RepeatUnit.DAY,
            sendTime: dayjs(subValues.sendTime).format('HH:mm:ss'),
          })  
        }
        await createMail({
          createMailRequest: { ...mailValues , subscriberIds: subscriberIds  }
        })
        onClose()
        form.resetFields()
        toast.success('Mail schedule set up successfully')
      }else{
        const sendMailResponse = await createAndSendMail({
          createMailRequest: { ...mailValues , subscriberIds: subscriberIds  }
        })
        if(sendMailResponse.data?.statusCode !== 200){
          onClose()
          toast.error('Send mail failed')
        }else{
          onClose()
          form.resetFields()
          toast.success('Mail sent successfully')
        }
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
          {isLoading ? 'Sending...' : 'Send Newsletter'}
        </Button>,
      ]}
      width={700}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="max-w-full">
           <Form.Item label="To">
            <div className='flex gap-2 w-full flex-wrap'>
              {subscriberData?.data?.filter((s) => subscriberIds.includes(s.id)).map((s) => (
                <div key={s.id} className=' cursor-pointer flex items-center'>
                  <span className='rounded-md bg-gray-200 px-2 hover:bg-blue-200'>{s.email}</span>
                  <span className='rounded-full px-2 flex items-center justify-center bg-red-300' onClick={() => handleRemoveSubscriber(s.id)}>x</span>
                </div>

              ))}
            </div>
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
          <Form.Item name="content" label="Content">
              <RichTextEditor customClass="custom-editor" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default CreateMailModal
