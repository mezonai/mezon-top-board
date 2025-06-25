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

function DetailCard() {
  const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)

  return (
    <div className='shadow-sm rounded-2xl bg-white p-4 '>
      <div className='pb-4'>
        <MtbTypography label={<InfoCircleOutlined className='text-xl !text-pink-500' />} variant='h3'>
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
        <MtbTypography variant='h3' label={<RiseOutlined className='text-xl !text-pink-500' />}>
          Socials
        </MtbTypography>
        <div>
          {mezonAppDetail?.supportUrl && (
            <MtbTypography variant='h5' weight='normal' label={<QuestionCircleTwoTone twoToneColor="#FF0000" />}>
              <a href={mezonAppDetail?.supportUrl} target='_blank' rel='noopener noreferrer' className='!text-black'>
                <u>{mezonAppDetail.name}'s Support link</u>
              </a>
            </MtbTypography>
          )}
          {mezonAppDetail?.socialLinks?.map((link) => (
            <MtbTypography key={link.id} variant='h5' weight='normal' label={<ImgIcon src={link.type.icon} width={17} />}>
              <a href={`${link.type.prefixUrl}${link.url}`} target='_blank' rel='noopener noreferrer' className='!text-black'>
                {link.type.prefixUrl}{link.url}
              </a>
            </MtbTypography>
          ))}
        </div>
      </div>
      <div className='pb-5'>
        <MtbTypography variant='h3' label={<TagOutlined className='text-xl !text-pink-500' />}>
          Categories
        </MtbTypography>
        <div className='pt-1'>
          {mezonAppDetail?.tags?.map((tag) => (
            <Tag key={tag.id} className='!cursor-pointer'>
              {tag?.name}
            </Tag>
          ))}
        </div>
      </div>
      <div className='pb-4'>
        <MtbTypography variant='h3' label={<UserOutlined className='text-xl !text-pink-500' />}>
          Creators
        </MtbTypography>
        <div className={`pt-2`}>
          <a href={`/profile/${userInfo.id === mezonAppDetail?.owner?.id ? '' : mezonAppDetail?.owner?.id}`}>
            <Tag className='!rounded-lg !pr-6 !py-3 !shadow-md !bg-white flex items-center w-full'>
              <div className='flex gap-4 items-center'>
                <div className='w-[40px] h-[40px] overflow-hidden rounded-xl flex-shrink-0'>
                  <img
                    src={mezonAppDetail?.owner?.profileImage ? getUrlMedia(mezonAppDetail?.owner.profileImage) : avatar}
                    alt=''
                    className='w-full h-full object-cover'
                  />
                </div>
                <MtbTypography variant='p' customClassName='!text-dark truncate' ellipsis={true}>
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
