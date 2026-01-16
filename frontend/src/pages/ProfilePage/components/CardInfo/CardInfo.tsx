import {
  CreditCardOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  SyncOutlined,
  UserAddOutlined,
  HeartOutlined
} from '@ant-design/icons'
import avatar from '@app/assets/images/default-user.webp'
import { AppEvent } from '@app/enums/AppEvent.enum'
import { TypographyStyle } from '@app/enums/typography.enum'
import MTBAvatar from '@app/mtb-ui/Avatar/MTBAvatar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import {
  useUserControllerSelfUpdateUserMutation,
  useUserControllerSyncMezonMutation,
} from '@app/services/api/user/user'
import { getUrlMedia } from '@app/utils/stringHelper'
import { Popconfirm } from 'antd'
import Button from '@app/mtb-ui/Button'
import { toast } from 'react-toastify'
import { CardInfoProps } from './CardInfo.types'
import { useState } from 'react'
import MediaManagerModal from '@app/components/MediaManager/MediaManager'
import { useTranslation } from "react-i18next";
import { CropImageShape } from '@app/enums/CropImage.enum'

function CardInfo({ isPublic, userInfo }: CardInfoProps) {
  const { t } = useTranslation(['profile_page']);
  const imgUrl = userInfo?.profileImage ? getUrlMedia(userInfo.profileImage) : avatar
  const [selfUpdate] = useUserControllerSelfUpdateUserMutation()
  const [syncMezon] = useUserControllerSyncMezonMutation()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const cardInfoLink = [
    {
      icon: <InfoCircleOutlined />,
      name: t('profile.card_info.overview'),
      path: isPublic ? `/profile/${userInfo?.id}` : `/profile`,
      isPublic: true
    },
    {
      icon: <FileImageOutlined />,
      name: t('profile.card_info.gallery'),
      path: '/profile/gallery',
      isPublic: false
    },
    {
      icon: <HeartOutlined />,
      name: t('profile.card_info.favorites'),
      path: '/profile/my-favorites',
      isPublic: false
    },
    {
      icon: <UserAddOutlined />,
      name: t('profile.card_info.invitations'),
      path: '/profile',
      isPublic: false
    },
    {
      icon: <CreditCardOutlined />,
      name: t('profile.card_info.subscriptions'),
      path: '/profile',
      isPublic: false
    },
    {
      icon: <SettingOutlined />,
      name: t('profile.card_info.settings'),
      path: '/profile/setting',
      isPublic: false
    }
  ]

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleMediaSelect = async (selection: string) => {
    setIsModalVisible(false); 
    try {
      await selfUpdate({
        selfUpdateUserRequest: {
          profileImage: selection
        }
      }).unwrap();
      toast.success(t('profile.card_info.update_success'));
    } catch (error) {
      toast.error(t('profile.card_info.update_failed'));
    }
  }

  const handleSyncMezon = async () => {
    if (isPublic) return

    try {
      await syncMezon(undefined).unwrap()
      window.dispatchEvent(new Event(AppEvent.SYNC_MEZON));
      toast.success(t('profile.card_info.sync_success'))
    } catch (error) {
      toast.error(t('profile.card_info.sync_failed'))
    }
  }

  return (
    <div className='flex flex-col gap-7 p-4 shadow-sm rounded-2xl'>
      <div className='flex items-center gap-4 w-full max-lg:flex-col max-2xl:flex-col'>
        <div className='flex-shrink-0 w-[120px] object-cover'>
          <div
            onClick={() => !isPublic && setIsModalVisible(true)}
            style={{ cursor: isPublic ? 'default' : 'pointer' }}
          >
            <MTBAvatar
              imgUrl={imgUrl}
              isAllowUpdate={!isPublic}
            />
          </div>
        </div>
        <div className='text-lg font-semibold break-words max-w-full flex-1 min-w-0'>{userInfo?.name}</div>
      </div>
      <div>
        <MtbTypography variant='p' customClassName='!pl-0' weight='bold' textStyle={[TypographyStyle.UPPERCASE]}>
          {t('profile.card_info.generals')}
        </MtbTypography>
        <MtbTypography variant='p' customClassName='!pl-0 !text-gray-500' size={14}>
          {userInfo?.bio}
        </MtbTypography>
        <p className='font-'></p>
        <ul className='pt-2'>
          {cardInfoLink
            .filter((item) => item.isPublic || !isPublic)
            .map((item, index) => (
              <li key={index} className='p-2 cursor-pointer align-middle hover:bg-heading transition-all'>
                <a href={item.path} className='w-full inline-block'>
                  <span className='mr-4'>{item.icon}</span>
                  {item.name}
                </a>
              </li>
            ))}
        </ul>
      </div>
      {!isPublic &&
        <Popconfirm
          title={t('profile.card_info.confirm_sync_title')}
          description={t('profile.card_info.confirm_sync_desc')}
          onConfirm={handleSyncMezon}
          okText={t('profile.card_info.yes')}
          cancelText={t('profile.card_info.no')}
        >
          <Button
            className='mt-2'
            size='large'
            variant='outlined'
            icon={<SyncOutlined />}
          >
            {t('profile.card_info.sync_mezon')}
          </Button>
        </Popconfirm>
      }
      <MediaManagerModal
        isVisible={isModalVisible}
        onChoose={handleMediaSelect}
        onClose={handleCancel}
        initialCropShape={CropImageShape.ROUND}
        showShapeSwitcher={false}
      />
    </div>
  )
}

export default CardInfo
