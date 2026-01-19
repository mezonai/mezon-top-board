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
import MtbRate from '@app/mtb-ui/Rate/Rate'

function BotGridItem({ data, isPublic = true, onRefresh, isCarouselItem = false }: IBotGridItemProps) {
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
      className='relative select-none p-3 cursor-pointer group h-full'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-start gap-3 w-full h-full relative">
        
        {!isPublic && (
           <div className="absolute -top-3 -left-3 z-20">
              <BadgeStatus status={t(mapStatusToText(data!.status))} color={mapStatusToColor(data!.status)} />
           </div>
        )}

        <div className='flex-shrink-0 w-16 h-16'>
          <img 
            src={imgUrl} 
            alt={data?.name} 
            className='w-full h-full'
          />
        </div>

        <div className='flex flex-col flex-1 min-w-0 gap-1 mr-6'>
          <div className='text-left font-bold text-base truncate text-primary leading-tight'>
            {data?.name || t('component.bot_grid_item.default_name')}
          </div>
          
          <div className='text-xs text-secondary truncate leading-tight'>
             {data?.headline || t('component.bot_grid_item.default_headline')}
          </div>

          <div className='flex items-center mt-1 scale-90 origin-left'>
              {isCarouselItem ? (
                  <MtbRate readonly={true} value={data?.rateScore || 0} size='small' isShowTooltip></MtbRate>
              ) : (
                  <MtbRate readonly={true} value={data?.rateScore || 0} isShowTooltip></MtbRate>
              )}
          </div>
        </div>

        <div className="owner-actions flex-shrink-0 -mt-1 -mr-2">
          <BotActions 
              data={data} 
              mode={ViewMode.GRID} 
              onNewVersionClick={handleOwnerNewVersionClick} 
              onRefresh={onRefresh}
          />
        </div>

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