import { QuestionCircleTwoTone, InfoCircleOutlined, RiseOutlined, TagOutlined, UserOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import avatar from '@app/assets/images/default-user.webp'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import { IMezonAppStore } from '@app/store/mezonApp'
import { IUserStore } from '@app/store/user'
import { getUrlMedia } from '@app/utils/stringHelper'
import { ImgIcon } from '@app/mtb-ui/ImgIcon/ImgIcon'
import { SocialLinkInMezonAppDetailResponse, TagInMezonAppDetailResponse } from '@app/services/api/mezonApp/mezonApp.types'

function DetailCard() {
  const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)

  return (
    <div className='shadow-sm rounded-2xl bg-container p-4 border border-transparent dark:border-border'>
      <div className='pb-4'>
        <MtbTypography label={<InfoCircleOutlined className='!text-xl !text-primary-active' />} variant='h3'>
          Details
        </MtbTypography>
        {mezonAppDetail.prefix && (
          <div className='pt-2'>
            <MtbTypography variant='h5' weight='normal'>
              Prefix: {mezonAppDetail.prefix}
            </MtbTypography>
          </div>
        )}
      </div>
      <div className='pb-4'>
        <MtbTypography variant='h3' label={<RiseOutlined className='text-xl !text-primary-active' />}>
          Socials
        </MtbTypography>
        <div>
          {mezonAppDetail?.supportUrl && (
            <MtbTypography variant='h5' weight='normal' label={<QuestionCircleTwoTone twoToneColor="#FF0000" />}>
              <a
                href={mezonAppDetail?.supportUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary transition-colors'
              >
                <u>{mezonAppDetail.name}'s Support link</u>
              </a>
            </MtbTypography>
          )}
          {mezonAppDetail?.socialLinks?.map((link: SocialLinkInMezonAppDetailResponse) => (
            <MtbTypography key={link.id} variant='h5' weight='normal' label={<ImgIcon src={getUrlMedia(link.type.icon)} width={17} />}>
              <a
                href={`${link.type.prefixUrl}${link.url}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary transition-colors'
              >
                {link.type.prefixUrl}{link.url}
              </a>
            </MtbTypography>
          ))}
        </div>
      </div>
      <div className='pb-5'>
        <MtbTypography variant='h3' label={<TagOutlined className='text-xl !text-primary-active' />}>
          Categories
        </MtbTypography>
        <div className='pt-1'>
          {mezonAppDetail?.tags?.map((tag: TagInMezonAppDetailResponse) => (
            <Tag 
              key={tag.id} 
              className='cursor-pointer !bg-container !text-secondary dark:!bg-container-secondary dark:!text-primary'
            >
              {tag?.name}
            </Tag>
          ))}
        </div>
      </div>
      <div className='pb-4'>
        <MtbTypography variant='h3' label={<UserOutlined className='text-xl !text-primary-active' />}>
          Creators
        </MtbTypography>
        <div className={`pt-2`}>
          <a href={`/profile/${userInfo.id === mezonAppDetail?.owner?.id ? '' : mezonAppDetail?.owner?.id}`}>
            <Tag className='!rounded-lg !pr-6 !py-3 !shadow-md !bg-container dark:!bg-container-secondary dark:!border-border flex items-center w-full !border-0 dark:!border'>
              <div className='flex gap-4 items-center'>
                <div className='w-[40px] h-[40px] overflow-hidden rounded-xl flex-shrink-0 bg-border dark:bg-border'>
                  <img
                    src={mezonAppDetail?.owner?.profileImage ? getUrlMedia(mezonAppDetail?.owner.profileImage) : avatar}
                    alt={mezonAppDetail?.owner?.name || 'Owner avatar'}
                    className='w-full h-full object-cover'
                  />
                </div>
                <MtbTypography variant='p' customClassName='truncate' ellipsis={true}>
                  {mezonAppDetail?.owner?.name}
                </MtbTypography>
              </div>
            </Tag>
          </a>
        </div>
      </div>
    </div >
  )
}

export default DetailCard