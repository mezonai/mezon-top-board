import {
  CreditCardOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  SyncOutlined,
  UserAddOutlined
} from '@ant-design/icons'
import avatar from '@app/assets/images/default-user.webp'
import { AppEvent } from '@app/enums/AppEvent.enum'
import { TypographyStyle } from '@app/enums/typography.enum'
import MTBAvatar from '@app/mtb-ui/Avatar/MTBAvatar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useMediaControllerCreateMediaMutation } from '@app/services/api/media/media'
import { useUserControllerSelfUpdateUserMutation, useUserControllerSyncMezonMutation } from '@app/services/api/user/user'
import { getUrlMedia } from '@app/utils/stringHelper'
import { Button, Popconfirm, Upload } from 'antd'
import { toast } from 'react-toastify'
import { CardInfoProps } from './CardInfo.types'
import { imageMimeTypes } from '@app/constants/mimeTypes'

function CardInfo({ isPublic, userInfo }: CardInfoProps) {
  const imgUrl = userInfo?.profileImage ? getUrlMedia(userInfo.profileImage) : avatar
  const [selfUpdate] = useUserControllerSelfUpdateUserMutation()
  const [uploadImage, { isLoading: isUpdatingAvatar }] = useMediaControllerCreateMediaMutation()
  const [syncMezon] = useUserControllerSyncMezonMutation()

  const cardInfoLink = [
    {
      icon: <InfoCircleOutlined />,
      name: 'Overview',
      path: isPublic ? `/profile/${userInfo?.id}` : `/profile`,
      isPublic: true
    },
    {
      icon: <UserAddOutlined />,
      name: 'Invitations',
      path: '/profile',
      isPublic: false
    },
    {
      icon: <CreditCardOutlined />,
      name: 'Subscriptions',
      path: '/profile',
      isPublic: false
    },
    {
      icon: <SettingOutlined />,
      name: 'Settings',
      path: '/profile/setting',
      isPublic: false
    }
  ]

  const handleUpload = async (options: any) => {
    if (isPublic) return

    const { file, onSuccess, onError } = options
    const maxFileSize = 4 * 1024 * 1024
    if (file.size > maxFileSize) {
      toast.error(`${file.name} file upload failed (exceeds 4MB)`);
      return ;
    }
    
    if (!imageMimeTypes.includes(file.type)) {
      toast.error('Please upload a valid image file!');
      onError(new Error('Invalid file type'));
      return;
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await uploadImage(formData).unwrap()

      if (response?.statusCode === 200) {
        await selfUpdate({ selfUpdateUserRequest: { profileImage: response?.data?.filePath } }).unwrap()
      }

      onSuccess(response, file)
      toast.success('Upload Success')
    } catch (error) {
      toast.error('Upload failed!')
      onError(error)
    }
  }

  const handleSyncMezon = async () => {
    if (isPublic) return

    try {
      await syncMezon(undefined).unwrap()
      window.dispatchEvent(new Event(AppEvent.SYNC_MEZON));
      toast.success('Sync Success')
    } catch (error) {
      toast.error('Sync failed!')
    }
  }

  return (
    <div className='flex flex-col gap-7 p-4 shadow-sm rounded-2xl'>
      <div className='flex items-center gap-4 w-full max-lg:flex-col max-2xl:flex-col'>
        <div className='flex-shrink-0'>
          <Upload accept={imageMimeTypes.join(',')} disabled={isPublic} listType='picture-circle' customRequest={handleUpload} showUploadList={false}>
            <MTBAvatar imgUrl={imgUrl} isAllowUpdate={!isPublic} isUpdatingAvatar={isUpdatingAvatar} />
          </Upload>
        </div>
        <div className='text-lg font-semibold break-words max-w-full flex-1 min-w-0'>{userInfo?.name}</div>
      </div>
      <div>
        <MtbTypography variant='p' customClassName='!pl-0' weight='bold' textStyle={[TypographyStyle.UPPERCASE]}>
          Generals
        </MtbTypography>
        <MtbTypography variant='p' customClassName='!pl-0 !text-gray-500' size={14}>
          {userInfo?.bio}
        </MtbTypography>
        <p className='font-'></p>
        <ul className='pt-2'>
          {cardInfoLink
            .filter((item) => item.isPublic || !isPublic)
            .map((item, index) => (
              <li key={index} className='p-2 cursor-pointer align-middle hover:bg-red-400 transition-all'>
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
          title='Confirm Sync from Mezon'
          description='Are you sure to sync name and avatar for this user? This action cannot be undone!'
          onConfirm={handleSyncMezon}
          okText='Yes'
          cancelText='No'
        >
          <Button
            className='mt-2'
            color='danger'
            size='large'
            variant='outlined'
            icon={<SyncOutlined />}
          >
            Sync from Mezon
          </Button>
        </Popconfirm>
      }
    </div>
  )
}

export default CardInfo
