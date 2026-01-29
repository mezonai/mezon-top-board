import { useNavigate } from 'react-router-dom'
import { IBotGridItemProps } from './BotGridItem.types'
import { getUrlMedia } from '@app/utils/stringHelper'
import { avatarBotDefault } from '@app/assets'
import BotActions from '../BotActions/BotActions'
import { useState } from 'react'
import type { AppVersion } from '@app/types/appVersion.types'
import PreviewModal from '../PreviewModal/PreviewModal'
import BotStatusBadge from '../BotStatusBadge/BotStatusBadge'
import { GlassCard } from '../GlassCard/GlassCard'
import { ViewMode } from '@app/enums/viewMode.enum'
import MtbRate from '@app/mtb-ui/Rate/Rate'
import { cn } from '@app/utils/cn'
import { ItemVariant } from '@app/enums/ItemVariant.enum'

function BotGridItem({ data, isPublic = true, onRefresh, variant = ItemVariant.FULL }: IBotGridItemProps) {
  const navigate = useNavigate()
  const [previewVersion, setPreviewVersion] = useState<AppVersion | undefined>(undefined);
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const isCompact = variant === ItemVariant.COMPACT;

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
      <div className={cn(
        "flex w-full h-full relative",
        "flex-col items-center justify-center text-center gap-2",
        !isCompact && "lg:flex-row lg:items-start lg:text-left lg:gap-3"
      )}>

        {!isPublic && (
          <div className="absolute -top-3 -left-3 z-20">
            <BotStatusBadge status={data!.status} variant="ribbon" />
          </div>
        )}

        <div className={cn(
          "flex-shrink-0 w-full aspect-square",
          !isCompact ? "max-w-[80px] lg:w-16 lg:h-16 lg:max-w-none" : "max-w-[120px]" 
        )}>
          <img
            src={imgUrl}
            alt={data?.name}
            className='w-full h-full object-cover rounded-xl'
          />
        </div>

        <div className={cn(
          "flex flex-col flex-1 min-w-0 w-full gap-0",
          !isCompact && "lg:mr-6 lg:gap-1"
        )}>
          <div className={cn(
            "font-bold text-primary leading-tight truncate text-sm text-center",
            !isCompact && "lg:text-base lg:text-left"
          )}>
            {data?.name || ""}
          </div>

          {!isCompact && (
            <div className="hidden lg:block">
              <div className='text-xs text-secondary truncate leading-tight'>
                {data?.headline || ""}
              </div>
              <div className='flex items-center mt-1 scale-90 origin-left'>
                <MtbRate readonly={true} value={data?.rateScore || 0} isShowTooltip></MtbRate>
              </div>
            </div>
          )}
        </div>

        {!isCompact && (
            <div className="owner-actions flex-shrink-0 -mt-1 -mr-2 hidden lg:block">
            <BotActions
                data={data}
                mode={ViewMode.GRID}
                onNewVersionClick={handleOwnerNewVersionClick}
                onRefresh={onRefresh}
            />
            </div>
        )}
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