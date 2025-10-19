import { Modal, List, Checkbox, Button, Spin } from 'antd'
import { useState, useEffect } from 'react'
import { Subscriber, useSubscribeControllerGetAllActiveSubscriberQuery } from '@app/services/api/subscribe/subscribe'

interface SubscriberPickerModalProps {
  open: boolean
  onClose: () => void
  selectedIds: string[]
  onChange: (subs: Subscriber[]) => void
}

const SubscriberPickerModal = ({
  open,
  onClose,
  selectedIds,
  onChange,
}: SubscriberPickerModalProps) => {
  const { data, isLoading } = useSubscribeControllerGetAllActiveSubscriberQuery(undefined, { skip: !open })
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds)

  useEffect(() => {
    if (open) setLocalSelected(selectedIds)
  }, [open, selectedIds])

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) setLocalSelected((prev) => [...prev, id])
    else setLocalSelected((prev) => prev.filter((x) => x !== id))
  }

  const handleSave = () => {
		const subscribers = (data?.data || []).filter((s) => localSelected.includes(s.id))
		onChange(subscribers)
		onClose()
	}

  return (
    <Modal
      title="Select Active Subscribers"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" onClick={handleSave}>Save</Button>,
      ]}
      width={600}
    >
      {isLoading ? (
        <Spin />
      ) : (
        <List
          dataSource={data?.data || []}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Checkbox
                checked={localSelected.includes(item.id)}
                onChange={(e) => handleToggle(item.id, e.target.checked)}
              >
                {item.email}
              </Checkbox>
            </List.Item>
          )}
        />
      )}
    </Modal>
  )
}

export default SubscriberPickerModal
