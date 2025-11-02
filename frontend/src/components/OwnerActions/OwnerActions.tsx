import { Dropdown, MenuProps, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import {
  useMezonAppControllerDeleteMezonAppMutation
} from '@app/services/api/mezonApp/mezonApp'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function OwnerActions({ data, isBotCard }: { data: any; isBotCard?: boolean }) {
  const navigate = useNavigate()

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation()
  }
  const [deleteBot] = useMezonAppControllerDeleteMezonAppMutation()
  const { confirm } = Modal

  const handleDeleteBot = (botId: string) => {
    confirm({
      title: 'Are you sure you want to delete this bot?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteBot({ requestWithId: { id: botId } }).unwrap()
          navigate('/')
          toast.success('Bot deleted successfully.')
        } catch (error) {
          toast.error('Failed to delete bot.')
        }
      }
    })
  }
  const items: MenuProps['items'] = [
    {
      label: 'Edit',
      key: '1',
      icon: <EditOutlined />,
      onClick: () => {
        navigate(`/new-bot/${data?.id}`)
      }
    },
    {
      label: 'Delete',
      key: '2',
      danger: true,
      icon: <DeleteOutlined />,
      onClick: () => {
        if (!data?.id) {
          toast.error('Invalid bot ID.')
          return
        }
        handleDeleteBot(data?.id)
      }
    }
  ]
  const menuProps = {
    items,
    onClick: handleMenuClick
  }
  return (
    <Dropdown.Button
      style={{ display: 'contents' }}
      size={isBotCard ? 'large' : 'middle'}
      getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
      buttonsRender={([leftBtn, rightBtn]) => [
        null,
        <span onClick={(e) => e.stopPropagation()} className={isBotCard ? '' : '!absolute !top-0 !right-0'}>
          {rightBtn}
        </span>
      ]}
      trigger={['click']}
      menu={menuProps}
    />
  )
}

export default OwnerActions
