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
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMouseDownPos({ x: e.clientX, y: e.clientY })
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mouseDownPos) return

    const dx = Math.abs(e.clientX - mouseDownPos.x)
    const dy = Math.abs(e.clientY - mouseDownPos.y)

    if (dx > 3 || dy > 3) {
      setIsDragging(true)
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mouseDownPos) return

    if (isDragging) {
      setMouseDownPos(null)
      return
    }

    const target = e.target as HTMLElement
    if (target.closest('.owner-actions')) return

    handleNavigateDetail(e)
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
      className='shadow-sm rounded-2xl p-4 bg-[var(--bg-container)] cursor-pointer relative z-1 select-none border border-transparent dark:border-[var(--border-color)] transition-colors duration-300'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {!isPublic && <BadgeStatus status={mapStatusToText(data!.status)} color={mapStatusToColor(data!.status)} />}
      <div className='relative'>
        <div className='w-20 m-auto'>
          <img src={imgUrl} alt='' className='aspect-square rounded-full object-cover w-full bg-[var(--bg-container-secondary)]' width={'100%'} />
        </div>
        {!isPublic && (<div className='owner-actions'>
          <OwnerActions data={data} onNewVersionClick={handleOwnerNewVersionClick} />
        </div>)}
      </div>
      <div className='pt-3 pb-3 font-black truncate text-[var(--text-primary)]'>{data?.name || 'Name'}</div>
      <div className='flex justify-between items-center text-[var(--text-secondary)] text-sm font-medium'>
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