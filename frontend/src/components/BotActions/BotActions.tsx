import { Dropdown, MenuProps, Modal } from 'antd'
import {
  DeleteOutlined, 
  EditOutlined, 
  ExclamationCircleOutlined, 
  ShareAltOutlined,
  UserAddOutlined, 
  MessageOutlined, 
  MoreOutlined,
  FacebookFilled, 
  TwitterCircleFilled, 
  LinkedinFilled
} from '@ant-design/icons'
import { useMezonAppControllerDeleteMezonAppMutation } from '@app/services/api/mezonApp/mezonApp'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BotActionsProps } from './BotActions.types'
import { useBotInteractions } from '@app/hook/useBotInteractions'
import styles from './BotActions.module.scss'
import { ViewMode } from '@app/enums/viewMode.enum'

function BotActions({ data, isBotCard, mode = ViewMode.LIST, onNewVersionClick }: BotActionsProps) {
  const { t } = useTranslation(['components'])
  const navigate = useNavigate()
  const { handleShareSocial, handleInvite, handleChatNow, isOwner } = useBotInteractions(data);

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

  const ownerItems: MenuProps['items'] = [
    ...(data?.hasNewUpdate ? [{
        label: t('component.owner_actions.new_version'),
        key: 'new_version',
        icon: <ExclamationCircleOutlined />,
        onClick: () => onNewVersionClick?.(data?.versions?.[0])
      }] : []),
    {
      label: t('component.owner_actions.edit'),
      key: 'edit',
      icon: <EditOutlined />,
      onClick: () => navigate(`/new-bot/${data?.id}`)
    },
    {
      label: t('component.owner_actions.delete'),
      key: 'delete',
      danger: true,
      icon: <DeleteOutlined />,
      onClick: () => data?.id ? handleDeleteBot(data.id) : toast.error(t('component.owner_actions.invalid_id'))
    }
  ];

  const publicItems: MenuProps['items'] = [
    {
      key: "chat",
      label: t("component.owner_actions.chat_now"),
      icon: <MessageOutlined />,
      onClick: handleChatNow
    },
    {
      key: "invite",
      label: t('component.bot_list_item.invite'),
      icon: <UserAddOutlined />,
      onClick: handleInvite
    },
    {
      key: "share",
      label: t("component.share_button.share"),
      icon: <ShareAltOutlined className="!text-blue-500" />,
      popupClassName: styles.botActions,
      children: [
        {
          key: "facebook",
          label: t("component.share_button.facebook"),
          icon: <FacebookFilled className="!text-blue-600" />,
          onClick: () => handleShareSocial('facebook'),
        },
        {
          key: "twitter",
          label: t("component.share_button.twitter"),
          icon: <TwitterCircleFilled className="!text-blue-400" />,
          onClick: () => handleShareSocial('twitter'),
        },
        {
          key: "linkedin",
          label: t("component.share_button.linkedin"),
          icon: <LinkedinFilled className="!text-blue-700" />,
          onClick: () => handleShareSocial('linkedin'),
        },
      ],
    }
  ];

  let finalItems: MenuProps['items'] = [];
  if (mode === ViewMode.LIST) {
     finalItems = ownerItems; 
  } else {
     finalItems = [...publicItems];
     if (isOwner) finalItems.push(...ownerItems);
  }

  if (finalItems.length === 0) return null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown.Button
        style={{ display: 'contents' }}
        overlayClassName={styles.botActions}
        size={isBotCard ? 'large' : 'middle'}
        buttonsRender={([_, rightBtn]) => [
          null,
          <span className={isBotCard ? '' : '!absolute !top-0 !right-0'}>
            {mode === ViewMode.GRID ? (
                <div className="ant-btn ant-btn-default ant-btn-icon-only cursor-pointer flex items-center justify-center bg-container border border-border rounded-lg w-8 h-8 hover:bg-container-secondary transition-all">
                    <MoreOutlined />
                </div>
            ) : rightBtn}
          </span>
        ]}
        trigger={['click']}
        menu={{ items: finalItems }}
      />
    </div>
  )
}

export default BotActions