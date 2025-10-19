import { Button, Form, Input, Modal, Tag } from 'antd'
import RichTextEditor from '@app/components/RichText/RichText'
import { Mail, useMailControllerGetAllMailsQuery, useMailControllerUpdateMailMutation } from '@app/services/api/mail/mail'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { PlusOutlined } from '@ant-design/icons'
import SubscriberPickerModal from '@app/pages/AdminPage/AdminManageMailSchedule/components/SubscriberPickerModal'
import { Subscriber } from '@app/services/api/subscribe/subscribe'

export interface MailFormValues {
  title: string,
  subject: string,
  content: string,
  subscriberIds: string[]
}

interface EditMailModalProps {
  open: boolean
  onClose: () => void
  selectMail?: Mail
}

const EditMailModal = ({ open, onClose, selectMail }: EditMailModalProps) => {

  const [updateMail, {isLoading}] = useMailControllerUpdateMailMutation()
  const [subscriberModalOpen, setSubscriberModalOpen] = useState(false)
	const { refetch } = useMailControllerGetAllMailsQuery()
  const [form] = Form.useForm<MailFormValues>()
  const [selectedSubscribers, setSelectedSubscribers] = useState<Subscriber[]>([])

  const handleRemoveSubscriber = (id: string) => {
     setSelectedSubscribers(prev => prev.filter(sub => sub.id !== id))
  }

  useEffect(() => {
    if (selectMail) {
      setSelectedSubscribers(selectMail.subscribers)
			form.setFieldsValue(selectMail);
    }
  }, [selectMail])

   const handleEditMail = async () => {
    try {
      const mailValues = form.getFieldsValue(['title', 'subject', 'content']);
      await updateMail({
				id: selectMail?.id!,
				updateMailRequest: {
					...mailValues,
					subscriberIds: selectedSubscribers.map(sub => sub.id)
				},
			});
			onClose();
			await refetch()
			toast.success('Mail updated successfully');
    } catch (e) {
      console.error('Send mail failed', e)
    }
  }

 
  return (
   <Modal
      title="Edit Mail"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="send" type="primary" onClick={handleEditMail} disabled={isLoading}>
          {isLoading ? 'Editing...' : 'Edit Mail'}
        </Button>,
      ]}
      width={700}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="max-w-full">
           <Form.Item label="To">
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 w-full flex-wrap'>
                {selectedSubscribers.map((s) => (
                  <div key={s.id} className='cursor-pointer flex items-center'>
                    <Tag>{s.email}</Tag>
                    <span
                      className='rounded-full px-2 flex items-center justify-center bg-red-300'
                      onClick={() => handleRemoveSubscriber(s.id)}
                    >
                      x
                    </span>
                  </div>
                ))}
              </div>
            <span className='rounded-full bg-blue-200 cursor-pointer px-1' onClick={() => setSubscriberModalOpen(true)}><PlusOutlined/></span>
            </div>
            </Form.Item>
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
      <SubscriberPickerModal
        open={subscriberModalOpen}
        onClose={() => setSubscriberModalOpen(false)}
        selectedIds={selectedSubscribers.map((s) => s.id)}
        onChange={(subs) => setSelectedSubscribers(subs)}
      />
    </Modal>
  )
}

export default EditMailModal
