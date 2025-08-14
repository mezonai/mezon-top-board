import { Space, Button, Popconfirm } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface CampaignActionsProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

const CampaignActions: React.FC<CampaignActionsProps> = ({ onView, onEdit, onDelete }) => {
  return (
    <Space>
      <Button title='View' icon={<EyeOutlined />} onClick={onView} />
      <Button title='Edit' icon={<EditOutlined />} onClick={onEdit} />
      <Popconfirm title='Are you sure to delete this campaign?' onConfirm={onDelete}>
        <Button title='Delete' danger icon={<DeleteOutlined />} />
      </Popconfirm>
       <Popconfirm
            title="Are you sure you want to delete this app?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
          </Popconfirm>
    </Space>
  )
}

export default CampaignActions
