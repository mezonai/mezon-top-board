import { cn } from '@app/utils/cn'
import { GlassCardProps } from './GlassCard.types'

export const GlassCard = ({ 
  children, 
  className, 
  style, 
  hoverEffect = false,
  onClick,
  ...props
}: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white/20 dark:bg-black/40 backdrop-blur-xl',
        'border border-white/20 dark:border-white/10',
        'shadow-sm',
        'transition-all duration-300 ease-out',
        hoverEffect && 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/80 dark:hover:bg-black/50 hover:border-white/40',
        className
      )}
      style={style}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}