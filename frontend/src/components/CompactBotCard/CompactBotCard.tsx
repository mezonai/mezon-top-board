import { RiseOutlined, StarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { ICompactBotCardProps } from '@app/components/BotCard/BotCard.types'
import { getUrlMedia } from '@app/utils/stringHelper'
import { avatarBotDefault } from '@app/assets'
import OwnerActions from '../OwnerActions/OwnerActions'
import { useState } from 'react'
import type { AppVersion } from '@app/types/appVersion.types'
import PreviewModal from '../PreviewModal/PreviewModal'
import BadgeStatus from '@app/components/BotStatusBadge/BotStatusBadge'
import { mapStatusToColor, mapStatusToText } from '@app/utils/mezonApp'

function CompactBotCard({ data, isPublic = true }: ICompactBotCardProps) {
  const navigate = useNavigate()
  const [previewVersion, setPreviewVersion] = useState<AppVersion | undefined>(undefined);
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMouseDownPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mouseDownPos) return

    const target = e.target as HTMLElement
    if (target.closest('.owner-actions')) return

    const dx = Math.abs(e.clientX - mouseDownPos.x)
    const dy = Math.abs(e.clientY - mouseDownPos.y)
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 5) {
      handleNavigateDetail(e)
    }
    setMouseDownPos(null)
  }

  const handleNavigateDetail = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (previewVersion) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (data?.id) {
      navigate(`/bot/${data?.id}`)
    }
  }
  const imgUrl = data?.featuredImage ? getUrlMedia(data.featuredImage) : avatarBotDefault

  const handleOwnerNewVersionClick = (version?: AppVersion) => {
    setPreviewVersion(version)
  }
  return (
    <div
      className='shadow-sm rounded-2xl p-4 bg-white cursor-pointer relative z-1 select-none'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {!isPublic && <BadgeStatus status={mapStatusToText(data!.status)} color={mapStatusToColor(data!.status)} />}
      <div className='relative'>
        <div className='w-20 m-auto'>
          <img src={imgUrl} alt='' className='aspect-square rounded-full object-cover w-full' width={'100%'} />
        </div>
        {!isPublic && (<div className='owner-actions'>
          <OwnerActions data={data} onNewVersionClick={handleOwnerNewVersionClick} />
        </div>)}
      </div>
      <div className='pt-3 pb-3 font-black truncate'>{data?.name || 'Name'}</div>
      <div className='flex justify-between items-center'>
        <p>
          <StarOutlined /> {data?.rateScore || 0}
        </p>
        <p>
          <RiseOutlined /> 841,999
        </p>
      </div>
      <PreviewModal
        open={!!previewVersion}
        onClose={() => setPreviewVersion(undefined)}
        appData={data}
        latestVersion={previewVersion}
      />
    </div>
  )
}

export default CompactBotCard
