import { useMemo } from 'react'
import { Dropdown, MenuProps, Modal } from 'antd'
import Button from '@app/mtb-ui/Button'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ShareAltOutlined,
  MessageOutlined,
  FacebookFilled,
  TwitterCircleFilled,
  LinkedinFilled,
  HeartFilled,
  HeartOutlined,
  MenuOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import { useMezonAppControllerDeleteMezonAppMutation } from '@app/services/api/mezonApp/mezonApp'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BotActionsProps } from './BotActions.types'
import { useBotInteractions } from '@app/hook/useBotInteractions'
import styles from './BotActions.module.scss'
import { ViewMode } from '@app/enums/viewMode.enum'

function BotActions({ data, mode = ViewMode.LIST, onNewVersionClick, onRefresh }: BotActionsProps) {
  const { t } = useTranslation(['components'])
  const navigate = useNavigate()
  const { 
    isFavorited, 
    isBusy, 
    handleToggleFavorite, 
    handleShareSocial, 
    handleChatNow, 
    handleInvite,
    isOwner 
  } = useBotInteractions(data);

  const [deleteBot] = useMezonAppControllerDeleteMezonAppMutation()
  const { confirm } = Modal

  const handleFavoriteClick = async () => {
    await handleToggleFavorite()
    if (onRefresh) onRefresh()
  };

  const handleDeleteBot = (botId: string) => {
    confirm({
      title: t('component.owner_actions.delete_confirm_title'),
      centered: true,
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

  const menuItems = useMemo(() => {
    const publicItems: MenuProps['items'] = [
      {
        key: "chat",
        label: t("component.owner_actions.chat_now"),
        icon: <MessageOutlined className='!text-heading !text-md'/>,
        onClick: handleChatNow,
      }
    ];

    if (mode === ViewMode.GRID) {
      publicItems.push({
        key: "invite",
        label: t("component.bot_list_item.invite"),
        icon: <UserAddOutlined className="!text-heading !text-md" />,
        onClick: handleInvite,
      });
    }

    publicItems.push(
      {
        key: "favorite",
        label: isFavorited ? t("component.share_button.remove_favorite") : t("component.share_button.add_favorite"),
        icon: isFavorited ? <HeartFilled className="!text-red-500 !text-md" /> : <HeartOutlined className="!text-red-500 !text-md" />,
        onClick: handleFavoriteClick,
        disabled: isBusy,
      },
      {
        key: "share",
        label: t("component.share_button.share"),
        icon: <ShareAltOutlined className="!text-blue-500 !text-md" />,
        popupClassName: styles.botActions,
        children: [
          {
            key: "facebook",
            label: t("component.share_button.facebook"),
            icon: <FacebookFilled className="!text-blue-600 !text-md" />,
            onClick: () => handleShareSocial('facebook'),
          },
          {
            key: "twitter",
            label: t("component.share_button.twitter"),
            icon: <TwitterCircleFilled className="!text-blue-400 !text-md" />,
            onClick: () => handleShareSocial('twitter'),
          },
          {
            key: "linkedin",
            label: t("component.share_button.linkedin"),
            icon: <LinkedinFilled className="!text-blue-700 !text-md" />,
            onClick: () => handleShareSocial('linkedin'),
          },
        ],
      }
    );

    if (isOwner) {
      if (data?.hasNewUpdate) {
        publicItems.push({
          label: t('component.owner_actions.new_version'),
          style: { whiteSpace: 'nowrap' },
          key: 'new_version',
          icon: <ExclamationCircleOutlined className="!text-md" />,
          onClick: () => {
            onNewVersionClick?.(data?.versions?.[0])
          }
        });
      }

      publicItems.push(
        {
          label: t('component.owner_actions.edit'),
          key: 'edit',
          icon: <EditOutlined className="!text-md !text-warning" />,
          onClick: () => navigate(`/new-bot/${data?.id}`)
        },
        {
          label: t('component.owner_actions.delete'),
          key: 'delete',
          danger: true,
          icon: <DeleteOutlined className="!text-md" />,
          onClick: () => {
            if (!data?.id) return toast.error(t('component.owner_actions.invalid_id'))
            handleDeleteBot(data?.id)
          }
        }
      );
    }

    return publicItems;
  }, [
    data,
    mode,
    t,
    navigate,
    isOwner,
    isFavorited,
    isBusy,
    onNewVersionClick,
    handleChatNow,
    handleInvite,
    handleShareSocial,
    handleFavoriteClick,
    handleDeleteBot
  ]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown
        menu={{ items: menuItems }}
        overlayClassName={styles.botActions}
        trigger={['click']}
        placement="bottomRight"
        arrow
      >
        <Button
          size="large"
          color="primary"
          variant="filled"
          icon={<MenuOutlined className="!text-secondary" />}
        />
      </Dropdown>
    </div>
  )
}

export default BotActions