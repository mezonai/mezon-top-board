import { Button, Form, InputNumber, Modal, TimePicker } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Subscriber, useSubscribeControllerGetAllSubscriberQuery, useSubscribeControllerUpdateScheduleMutation } from '@app/services/api/subscribe/subscribe'
import { RepeatUnit } from '@app/enums/subscribe'
import Checkbox from '@app/pages/AdminPage/AdminManageMailSchedule/components/Checkbox'
import RepeatUnitSelect from '@app/pages/AdminPage/AdminManageMailSchedule/components/Select'
import dayjs, { Dayjs } from 'dayjs'

export interface SubscriberFormValues {
  isRepeatable: boolean
  repeatEvery: number
  repeatUnit: RepeatUnit
  sendTime: Dayjs | null
}

interface EditSubscriberModalProps {
  open: boolean
  onClose: () => void
  selectSubscriber?: Subscriber
}

const EditSubscriberModal = ({ open, onClose, selectSubscriber }: EditSubscriberModalProps) => {

  const [updateSubscriber, {isLoading}] = useSubscribeControllerUpdateScheduleMutation()
	const { refetch } = useSubscribeControllerGetAllSubscriberQuery()
  const [form] = Form.useForm<SubscriberFormValues>()
  const [checked, setChecked] = useState<boolean>();
  const [unit, setUnit] = useState<RepeatUnit>();


  useEffect(() => {
    if (selectSubscriber) {
			form.setFieldsValue({
      ...selectSubscriber,
      sendTime: selectSubscriber.sendTime ? dayjs(selectSubscriber.sendTime, 'HH:mm') : null,
    })
      setChecked(selectSubscriber.isRepeatable!)
      setUnit(selectSubscriber.repeatUnit!)
    }
  }, [selectSubscriber])

   const handleEditMail = async () => {
    try {
      const subscriberValues = form.getFieldsValue();
      const { sendTime, ...rest } = subscriberValues;

      await updateSubscriber({
        id: selectSubscriber?.id!,
        sendTime: sendTime ? sendTime.format('HH:mm:ss') : undefined,
        ...rest,
      });

      onClose();
      await refetch();
      toast.success('Subscriber updated successfully')
    } catch (e) {
      console.error('Update subscriber failed', e)
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
          {isLoading ? 'Editing...' : 'Edit Subscriber'}
        </Button>,
      ]}
      width={700}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="max-w-full">
          <Form.Item name="isRepeatable" label="Repeat">
              <Checkbox 
                checked={checked}
                onChange={setChecked} 
              />
          </Form.Item>
          <Form.Item name="sendTime" label="Send time">
              <TimePicker format="HH:mm:ss"/>
          </Form.Item>
          <Form.Item name="repeatEvery" label="Repeat every">
             <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="repeatUnit" label="Repeat unit">
             <RepeatUnitSelect value={unit} onChange={setUnit} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default EditSubscriberModal
