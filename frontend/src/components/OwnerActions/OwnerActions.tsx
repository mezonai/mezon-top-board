import { Dropdown, MenuProps, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import {
  useMezonAppControllerDeleteMezonAppMutation
} from '@app/services/api/mezonApp/mezonApp'
import { AppVersion } from '@app/types/appVersion.types'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import styles from './OwnerActions.module.scss'
import { useTranslation } from 'react-i18next'

function OwnerActions({ data, isBotCard, onNewVersionClick }: { data: any; isBotCard?: boolean; onNewVersionClick?: (version?: AppVersion) => void }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation()
  }
  const [deleteBot] = useMezonAppControllerDeleteMezonAppMutation()
  const { confirm } = Modal

  const handleDeleteBot = (botId: string) => {
    confirm({
      title: t('component.owner_actions.delete_confirm_title'),
      icon: <ExclamationCircleOutlined />,
      content: t('component.owner_actions.delete_confirm_content'),
      okText: t('component.owner_actions.delete_confirm_ok'),
      okType: 'danger',
      cancelText: t('component.owner_actions.cancel'),
      onOk: async () => {
        try {
          await deleteBot({ requestWithId: { id: botId } }).unwrap()
          navigate('/')
          toast.success(t('component.owner_actions.delete_success'))
        } catch (error) {
          toast.error(t('component.owner_actions.delete_error'))
        }
      }
    })
  }
  const newVersionItems = data?.hasNewUpdate
    ? [{
        label: t('component.owner_actions.new_version'),
        style: { whiteSpace: 'nowrap' },
        key: '0',
        icon: <ExclamationCircleOutlined />,
        onClick: () => {
          onNewVersionClick?.(data?.versions?.[0])
        }
      }]
    : []

  const items: MenuProps['items'] = [
    ...newVersionItems,
    {
      label: t('component.owner_actions.edit'),
      key: '1',
      icon: <EditOutlined />,
      onClick: () => {
        navigate(`/new-bot/${data?.id}`)
      }
    },
    {
      label: t('component.owner_actions.delete'),
      key: '2',
      danger: true,
      icon: <DeleteOutlined />,
      onClick: () => {
        if (!data?.id) {
          toast.error(t('component.owner_actions.invalid_id'))
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
    <div className={styles.ownerActions}>
      <Dropdown.Button
        style={{ display: 'contents' }}
        size={isBotCard ? 'large' : 'middle'}
        getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
        buttonsRender={([_, rightBtn]) => [
          null,
          <span onClick={(e) => e.stopPropagation()} className={isBotCard ? '' : '!absolute !top-0 !right-0'}>
            {rightBtn}
          </span>
        ]}
        trigger={['click']}
        menu={menuProps}
      />
    </div>
  )
}

export default OwnerActions
