import { PlusOutlined } from '@ant-design/icons'
import { Modal, List, Spin, Checkbox, Button } from 'antd'
import { useState } from 'react'
import { useSubscribeControllerGetAllSubscriberQuery } from '@app/services/api/subscribe/subscribe'

const SubscriberPicker = () => {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { data, isLoading } = useSubscribeControllerGetAllSubscriberQuery(undefined, { skip: !open })

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <span
        className="rounded-full bg-blue-200 cursor-pointer px-1 inline-flex items-center justify-center"
        onClick={handleOpen}
      >
        <PlusOutlined />
      </span>

      <Modal
        title="Select Active Subscribers"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={600}
      >
        {isLoading ? (
          <Spin />
        ) : (
        <>
          <List
            dataSource={data?.data || []}
            renderItem={(item) => (
            <List.Item key={item.id}>
            <Checkbox
              checked={selectedIds.includes(item.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds((prev) => [...prev, item.id])
                } else {
                  setSelectedIds((prev) => prev.filter((id) => id !== item.id))
                }
              }}
            >
              {item.email}
              </Checkbox>
              </List.Item>
            )}
          />
          <Button type="primary" onClick={() => {
            console.log('Selected subscriber IDs:', selectedIds)
            handleClose()
          }}>
            Add Subscribers
          </Button>        
        </>
        )}
      </Modal>
    </>
  )
}

export default SubscriberPicker
