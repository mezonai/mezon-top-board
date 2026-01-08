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
import {
  useMezonAppControllerDeleteMezonAppMutation
} from '@app/services/api/mezonApp/mezonApp'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import styles from './OwnerActions.module.scss'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import { IUserStore } from '@app/store/user'
import { getMezonInstallLink } from '@app/utils/mezonApp'
import { safeConcatUrl, getUrlMedia } from '@app/utils/stringHelper'
import { avatarBotDefault } from '@app/assets'
import { OwnerActionsProps } from './OwnerAction.types'
import { ViewMode } from '@app/enums/viewMode.enum'

function OwnerActions({ data, isBotCard, mode = ViewMode.LIST, onNewVersionClick }: OwnerActionsProps) {
  const { t } = useTranslation(['components'])
  const navigate = useNavigate()
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)
  const isOwner = userInfo?.id && data?.owner?.id === userInfo?.id;

  const shareUrl = process.env.REACT_APP_SHARE_URL || 'https://top.mezon.ai/bot/'
  const fullShareUrl = safeConcatUrl(shareUrl, data?.id || '')
  const inviteUrl = getMezonInstallLink(data?.type, data?.mezonAppId)

  const handleShareSocial = (platformUrl: string) => {
    window.open(platformUrl, "_blank");
  };

  const handleInvite = () => {
    window.open(inviteUrl, '_blank')
  }

  const handleChat = () => {
    if (!data?.mezonAppId) return
    const payload = {
      id: data.mezonAppId || '',
      name: data?.name || 'Unknown',
      avatar: data?.featuredImage ? getUrlMedia(data.featuredImage) : avatarBotDefault
    }
    const dataBot = btoa(encodeURIComponent(JSON.stringify(payload)))
    const chatUrl = `https://mezon.ai/chat/${data.mezonAppId}?data=${dataBot}`
    window.open(chatUrl, '_blank')
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
          if(mode === ViewMode.LIST) navigate('/')
          toast.success(t('component.owner_actions.delete_success'))
        } catch (error) {
          toast.error(t('component.owner_actions.delete_error'))
        }
      }
    })
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    e.domEvent.stopPropagation()
  }
  const ownerItems: MenuProps['items'] = [
    ...(data?.hasNewUpdate ? [{
        label: t('component.owner_actions.new_version'),
        style: { whiteSpace: 'nowrap' },
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
      onClick: handleChat
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
      popupClassName: styles.ownerActions,
      children: [
        {
          key: "facebook",
          label: t("component.share_button.facebook"),
          icon: <FacebookFilled className="!text-blue-600" />,
          onClick: () => handleShareSocial(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`),
        },
        {
          key: "twitter",
          label: t("component.share_button.twitter"),
          icon: <TwitterCircleFilled className="!text-blue-400" />,
          onClick: () => handleShareSocial(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${data.name} ${fullShareUrl}`)}`),
        },
        {
          key: "linkedin",
          label: t("component.share_button.linkedin"),
          icon: <LinkedinFilled className="!text-blue-700" />,
          onClick: () => handleShareSocial(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullShareUrl)}`),
        },
      ],
    }
  ];

  let finalItems: MenuProps['items'] = [];

  if (mode === ViewMode.LIST) {
     finalItems = ownerItems; 
  } else {
     finalItems = [...publicItems];
     if (isOwner) {
       finalItems.push(...ownerItems);
     }
  }

  if (finalItems.length === 0) return null;

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()} 
      onMouseUp={(e) => e.stopPropagation()}
    >
      <Dropdown.Button
        style={{ display: 'contents' }}
        overlayClassName={styles.ownerActions}
        size={isBotCard ? 'large' : 'middle'}
        buttonsRender={([_, rightBtn]) => [
          null,
          <span className={isBotCard ? '' : '!absolute !top-0 !right-0'}>
            {mode === 'grid' ? (
                <div className="ant-btn ant-btn-default ant-btn-icon-only cursor-pointer flex items-center justify-center bg-container border border-border rounded-lg w-8 h-8 hover:bg-container-secondary transition-all">
                    <MoreOutlined />
                </div>
            ) : rightBtn}
          </span>
        ]}
        trigger={['click']}
        menu={{ items: finalItems, onClick: handleMenuClick }}
      />
    </div>
  )
}

export default OwnerActions