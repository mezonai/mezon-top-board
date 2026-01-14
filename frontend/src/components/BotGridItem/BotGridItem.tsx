import { StarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { IBotGridItemProps } from './BotGridItem.types'
import { getUrlMedia } from '@app/utils/stringHelper'
import { avatarBotDefault } from '@app/assets'
import BotActions from '../BotActions/BotActions'
import { useState } from 'react'
import type { AppVersion } from '@app/types/appVersion.types'
import PreviewModal from '../PreviewModal/PreviewModal'
import BadgeStatus from '@app/components/BotStatusBadge/BotStatusBadge'
import { mapStatusToColor, mapStatusToText } from '@app/utils/mezonApp'
import { GlassCard } from '../GlassCard/GlassCard'
import { useTranslation } from 'react-i18next'
import { ViewMode } from '@app/enums/viewMode.enum'

function BotGridItem({ data, isPublic = true, onRefresh }: IBotGridItemProps) {
  const { t } = useTranslation(['components'])
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

    if (e.currentTarget && !e.currentTarget.contains(e.target as Node)) {
      return; 
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
    <GlassCard
      hoverEffect={true}
      className='relative select-none flex items-center gap-3 p-3'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {!isPublic && (
         <BadgeStatus status={t(mapStatusToText(data!.status))} color={mapStatusToColor(data!.status)} />
      )}

      <div className='flex-shrink-0 w-16 h-16'>
        <img 
          src={imgUrl} 
          alt={data?.name} 
          className='w-full h-full object-cover rounded-2xl bg-secondary'
        />
      </div>

      <div className='flex flex-col flex-1 min-w-0 gap-1'>
        <div className='font-bold text-base truncate text-primary pr-8'>
          {data?.name || t('component.bot_grid_item.default_name')}
        </div>
        
        <div className='text-sm text-secondary truncate'>
            {data?.headline || t('component.bot_grid_item.default_headline')}
        </div>

        <div className='flex items-center gap-1 text-sm'>
            <StarOutlined className="text-warning" />
            <span className='text-secondary mt-[1px]'>{data?.rateScore || 0}</span>
        </div>
      </div>

      <div className="owner-actions absolute top-2 right-2 z-10">
        <BotActions 
            data={data} 
            mode={ViewMode.GRID} 
            onNewVersionClick={handleOwnerNewVersionClick} 
            onRefresh={onRefresh}
        />
      </div>

      <PreviewModal
        open={!!previewVersion}
        onClose={() => setPreviewVersion(undefined)}
        appData={data}
        latestVersion={previewVersion}
      />
    </GlassCard>
  )
}

export default BotGridItem