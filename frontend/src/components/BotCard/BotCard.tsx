import { UploadOutlined } from '@ant-design/icons'
import { avatarBotDefault } from '@app/assets'
import { AppStatus } from '@app/enums/AppStatus.enum'
import Button from '@app/mtb-ui/Button'
import MtbRate from '@app/mtb-ui/Rate/Rate'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { IBotCardProps } from '@app/types/Botcard.types'
import { randomColor } from '@app/utils/mezonApp'
import { getUrlImage, safeConcatUrl, uuidToNumber } from '@app/utils/stringHelper'
import { Popover, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import ShareButton from './components/ShareButton'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import { IUserStore } from '@app/store/user'
import OwnerActions from '../OwnerActions/OwnerActions'

function BotCard({ readonly = false, data, canNavigateOnClick = true }: IBotCardProps) {
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)
  const navigate = useNavigate()
  const handleInvite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    window.open(data?.installLink, '_blank')
  }
  const handleShare = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
  }
  const titleMaxWidth = data?.owner?.id === userInfo?.id ? 'md:max-w-[calc(100%-150px)]' : 'md:max-w-[calc(100%-100px)]';

  const imgUrl = data?.featuredImage ? getUrlImage(data.featuredImage) : avatarBotDefault
  // Share to social media
  const shareUrl = process.env.REACT_APP_SHARE_URL || 'https://top.mezon.ai/bot/'
  const title = data?.name || 'Check out this app!'

  
  return (
    <div
      className='shadow-md pb-8 pt-8 px-8 border border-gray-300 relative rounded-xl cursor-pointer'
      onClick={canNavigateOnClick ? () => navigate(`/bot/${data?.id}`) : undefined}
    >
      <div className='flex flex-col md:flex-row items-start gap-6 w-full'>
        <div className='w-24 md:w-36 flex-shrink-0'>
          <img src={imgUrl} alt='Bot' className='w-full h-auto object-cover aspect-square' />
        </div>

        <div className='flex flex-1 flex-col gap-3 overflow-hidden min-w-0 w-full'>
          <div className='truncate-title '>
            <style>
              {`
                .truncate-title .ant-typography {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                }
              `}
            </style>
            <MtbTypography
              variant='h4'
              customClassName={`${titleMaxWidth} max-w-full`}
            >
              {data?.name}
            </MtbTypography>
          </div>
          <div className='flex gap-1'>
            {data?.status !== AppStatus.PUBLISHED && <Tag color='red'>UNPUBLISHED</Tag>}
            <MtbRate readonly={readonly} value={data?.rateScore}></MtbRate>
          </div>
          <div className='flex-wrap gap-2'>
            {data?.tags?.map((tag) => (
              <Tag key={tag?.id} color={randomColor('normal', uuidToNumber(tag?.id))} style={{ marginBottom: '0.2rem' }} >
                {tag?.name}
              </Tag>
            ))}
          </div>
          <div className='sm:absolute sm:top-2 sm:right-2 flex gap-3'>
            {data?.owner?.id === userInfo?.id && (
              <OwnerActions data={data} isBotCard={true} />
            )}
            <Button variant='solid' color='secondary' size='large' onClick={handleInvite}>
              Invite
            </Button>
            <Popover
              content={<ShareButton text={`Check out ${title} Mezon Bot on top.nccsoft.vn, the #1 Mezon Bot and Mezon App List!`} url={safeConcatUrl(shareUrl, data?.id || '')} />}
              trigger='click'
              placement='bottomRight'
              arrow={false}
              overlayInnerStyle={{ marginTop: '8px', minWidth: '200px', maxWidth: '300px' }}
            >
              <Button size='large' color='default' icon={<UploadOutlined />} onClick={handleShare} />
            </Popover>
          </div>
          <div
            className='text-gray-700 break-words max-w-full'
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3
            }}
          >
            {data?.headline}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotCard
