import { Button, Form, Modal, Select } from 'antd'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Subscriber, useSubscribeControllerGetAllSubscriberQuery, useSubscribeControllerUpdateMutation } from '@app/services/api/subscribe/subscribe'
import { SubscriptionStatus } from '@app/enums/subscribe'

export interface SubscriberFormValues {
  status: SubscriptionStatus
}

interface EditSubscriberModalProps {
  open: boolean
  onClose: () => void
  selectSubscriber?: Subscriber
}

enum ActiveStatus {
  ACTIVE = 'ACTIVE',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

enum PendingStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
}

function getStatusEnum(currentStatus: string) {
  switch (currentStatus) {
    case PendingStatus.PENDING:
      return PendingStatus;

    case ActiveStatus.ACTIVE:
      return ActiveStatus;

    case ActiveStatus.UNSUBSCRIBED:
      return ActiveStatus;

    default:
      return PendingStatus;
  }
}

const EditSubscriberModal = ({ open, onClose, selectSubscriber }: EditSubscriberModalProps) => {

  const [updateSubscriber, {isLoading}] = useSubscribeControllerUpdateMutation()
	const { refetch } = useSubscribeControllerGetAllSubscriberQuery()
  const [form] = Form.useForm<SubscriberFormValues>()


  useEffect(() => {
    if (selectSubscriber) {
			form.setFieldsValue(selectSubscriber)
    }
  }, [selectSubscriber])

   const handleEditMail = async () => {
    try {
      const subscriberValues = form.getFieldsValue();

      await updateSubscriber({
        id: selectSubscriber?.id!,
        status: subscriberValues.status,
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
          <Form.Item name="status" label="Status">
           <Select
              placeholder="Select Status"
              value={form.getFieldValue('status')}
              onChange={(value) => form.setFieldsValue({ status: value })}
              options={Object.values(getStatusEnum(form.getFieldValue('status'))).map((status) => ({
                value: status,
                label: status,
              }))}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default EditSubscriberModal
