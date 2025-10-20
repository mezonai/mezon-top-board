import { Button, Form, Input, InputNumber, Modal, TimePicker } from 'antd'
import RichTextEditor from '@app/components/RichText/RichText'
import { Mail, useMailControllerGetAllMailsQuery, useMailControllerUpdateMailMutation } from '@app/services/api/mail/mail'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Checkbox from '@app/pages/AdminPage/AdminManageMailSchedule/components/Checkbox'
import RepeatUnitSelect from '@app/pages/AdminPage/AdminManageMailSchedule/components/Select'
import { RepeatUnit } from '@app/enums/subscribe'
import dayjs from 'dayjs'

export interface MailFormValues {
  title: string,
  subject: string,
  content: string,
  isRepeatable: boolean
  repeatEvery: number
  repeatUnit: RepeatUnit
  sendTime: string
}

interface EditMailModalProps {
  open: boolean
  onClose: () => void
  selectMail?: Mail
}

const EditMailModal = ({ open, onClose, selectMail }: EditMailModalProps) => {

  const [updateMail, {isLoading}] = useMailControllerUpdateMailMutation()
	const { refetch } = useMailControllerGetAllMailsQuery()
  const [form] = Form.useForm<MailFormValues>()
  const [checked, setChecked] = useState(false);
  const [unit, setUnit] = useState<RepeatUnit | undefined>();

  useEffect(() => {
    if (selectMail) {
			form.setFieldsValue(selectMail);
    }
  }, [selectMail])

   const handleEditMail = async () => {
    try {
      const mailValues = form.getFieldsValue();
      await updateMail({
				id: selectMail?.id!,
				updateMailRequest: {
          ...mailValues,
          sendTime: mailValues.isRepeatable ? dayjs(mailValues.sendTime).toISOString() : undefined,
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

export default EditMailModal
