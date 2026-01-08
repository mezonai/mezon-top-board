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
  LinkedinFilled,
  HeartFilled,
  HeartOutlined
} from '@ant-design/icons'
import { useMezonAppControllerDeleteMezonAppMutation } from '@app/services/api/mezonApp/mezonApp'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BotActionsProps } from './BotActions.types'
import { useBotInteractions } from '@app/hook/useBotInteractions'
import styles from './BotActions.module.scss'
import { ViewMode } from '@app/enums/viewMode.enum'

function BotActions({ data, mode = ViewMode.LIST, onNewVersionClick }: BotActionsProps) {
  const { t } = useTranslation(['components'])
  const navigate = useNavigate()
  const { isFavorited, isBusy, handleToggleFavorite, handleShareSocial, handleInvite, handleChatNow, isOwner } = useBotInteractions(data);

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
        key: 'new_version',
        icon: <ExclamationCircleOutlined />,
        onClick: () => {
          onNewVersionClick?.(data?.versions?.[0])
        }
      }]
    : []

  const ownerItems: MenuProps['items'] = [
    ...newVersionItems,
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
      onClick: () => {
        if (!data?.id) return toast.error(t('component.owner_actions.invalid_id'))
        handleDeleteBot(data?.id)
      }
    }
  ];

  const publicItems: MenuProps['items'] = [
    {
      key: "chat",
      label: t("component.owner_actions.chat_now"),
      icon: <MessageOutlined />,
      onClick: handleChatNow,
    },
    {
      key: "invite",
      label: t('component.bot_list_item.invite'),
      icon: <UserAddOutlined />,
      onClick: handleInvite,
    },
    {
      key: "favorite",
      label: isFavorited ? t("component.share_button.remove_favorite") : t("component.share_button.add_favorite"),
      icon: isFavorited ? <HeartFilled className="!text-red-500" /> : <HeartOutlined className="!text-red-500" />,
      onClick: handleToggleFavorite,
      disabled: isBusy,
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

  const finalItems: MenuProps['items'] = [];
  if (isOwner) {
    finalItems.push(...ownerItems);
  }

  if (mode === ViewMode.GRID) {
    finalItems.unshift(...publicItems);
  }

  if (finalItems.length === 0) return null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown.Button
        style={{ display: 'contents' }}
        overlayClassName={styles.botActions}
        size={mode === ViewMode.LIST ? 'large' : 'middle'} 
        buttonsRender={([_, rightBtn]) => [
          null,
          <span className={mode === ViewMode.LIST ? '' : '!absolute !top-0 !right-0'}>
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