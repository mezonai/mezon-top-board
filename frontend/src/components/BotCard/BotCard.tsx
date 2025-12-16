import { UploadOutlined } from '@ant-design/icons'
import { avatarBotDefault } from '@app/assets'
import { AppStatus } from '@app/enums/AppStatus.enum'
import Button from '@app/mtb-ui/Button'
import MtbRate from '@app/mtb-ui/Rate/Rate'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { IBotCardProps } from './BotCard.types'
import { randomColor, getMezonInstallLink } from '@app/utils/mezonApp'
import { getUrlMedia, safeConcatUrl, uuidToNumber } from '@app/utils/stringHelper'
import { Popover, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import ShareButton from './components/ShareButton'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import { IUserStore } from '@app/store/user'
import OwnerActions from '../OwnerActions/OwnerActions'
import MessageButton from '@app/pages/BotDetailPage/components/MessageButton/MessageButton'
import PreviewModal from '../PreviewModal/PreviewModal'
import { useState } from 'react'
import type { AppVersion } from '@app/types/appVersion.types'
import TagPill from '@app/components/TagPill/TagPill';
import { TagInMezonAppDetailResponse } from '@app/services/api/mezonApp/mezonApp.types'
import { cn } from '@app/utils/cn'

function BotCard({ readonly = false, data, canNavigateOnClick = true }: IBotCardProps) {
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)
  const navigate = useNavigate()
  const titleMaxWidth = data?.owner?.id === userInfo?.id ? 'md:max-w-[calc(80%-150px)]' : 'md:max-w-[calc(70%-100px)]';

  const imgUrl = data?.featuredImage ? getUrlMedia(data.featuredImage) : avatarBotDefault
  const shareUrl = process.env.REACT_APP_SHARE_URL || 'https://top.mezon.ai/bot/'
  const title = data?.name || 'Check out this app!'
  const inviteUrl = getMezonInstallLink(data?.type, data?.mezonAppId)
  const [previewVersion, setPreviewVersion] = useState<AppVersion | undefined>(undefined);

  const handleInvite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    window.open(inviteUrl, '_blank')
  }
  const handleShare = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
  }

  const handleOwnerNewVersionClick = (version?: AppVersion) => {
    setPreviewVersion(version)
  }

  return (
    <div
      className={cn(
        'card-base',
        'border-border border rounded-lg shadow-md',
        'flex flex-col gap-6 p-8 relative',
        'cursor-pointer transition-all',
      )}
      onClick={canNavigateOnClick ? () => navigate(`/bot/${data?.id}`) : undefined}
    >
      <div className='flex flex-col md:flex-row items-start gap-6 w-full'>
        <div className='w-24 md:w-36 flex-shrink-0'>
          <img src={imgUrl} alt='Bot' className='w-full h-auto object-cover aspect-square' />
        </div>

        <div className='flex flex-1 flex-col gap-3 overflow-hidden min-w-0 w-full'>
          <div className='flex flex-1 items-center'>
            {data?.type && (
              <TagPill value={data.type} />
            )}
            {data?.pricingTag && (
              <TagPill value={data.pricingTag} />
            )}
            
            <div className='flex-1 min-w-0'>
              <MtbTypography
                variant='h4'
                customClassName={cn(
                  titleMaxWidth, 
                  "!mb-0 text-text-primary",
                  "truncate" 
                )}
                label={data?.name} 
              />
            </div>
          </div>

          <div className='flex gap-1 flex-wrap'>
            {data?.status !== AppStatus.PUBLISHED && <Tag color='red'>UNPUBLISHED</Tag>}
            {userInfo?.id && data?.owner?.id === userInfo?.id && data?.hasNewUpdate && (
              <Tag color='blue'>
                NEW VERSION
              </Tag>
            )}
            <MtbRate readonly={readonly} value={data?.rateScore}></MtbRate>
          </div>

          <div className='flex flex-wrap'>
            {data?.tags?.map((tag: TagInMezonAppDetailResponse) => (
              <Tag key={tag?.id} color={randomColor('normal', uuidToNumber(tag?.id))} className="mb-[0.2rem]">
                {tag?.name}
              </Tag>
            ))}
          </div>
          <div className='sm:absolute sm:top-2 sm:right-2 flex gap-3 relative z-1'>
            {userInfo?.id && data?.owner?.id === userInfo?.id && (
              <OwnerActions data={data} isBotCard={true} onNewVersionClick={handleOwnerNewVersionClick} />
            )}
            <MessageButton data={data!} />
            <Button color='primary' variant='solid' size='large' onClick={handleInvite}>
              Invite
            </Button>
            <Popover
              content={<ShareButton text={`Check out ${title} Mezon Bot on top.nccsoft.vn, the #1 Mezon Bot and Mezon App List!`} url={safeConcatUrl(shareUrl, data?.id || '')} />}
              trigger='click'
              placement='bottomRight'
              arrow={false}
              overlayClassName={cn('mt-8', 'min-w-[200px]', 'max-w-[300px]')}
            >
              <Button size='large' color='default' variant='outlined' icon={<UploadOutlined />} onClick={handleShare} />
            </Popover>
          </div>
          <div className='break-words max-w-full text-text-secondary line-clamp-3'>
            {data?.headline}
          </div>
        </div>
      </div>
      <PreviewModal
        open={!!previewVersion}
        onClose={() => setPreviewVersion(undefined)}
        appData={data!}
        latestVersion={data?.versions?.[0]}
      />
    </div>
  )
}

export default BotCard