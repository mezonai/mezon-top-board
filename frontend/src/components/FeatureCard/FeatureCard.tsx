import { FeatureCardProps } from './FeatureCard.types';
import MtbTypography from '@app/mtb-ui/Typography/Typography';
import { cn } from '@app/utils/cn'
import { GlassCard } from '../GlassCard/GlassCard';

export const FeatureCard = ({ icon, title, children, color }: FeatureCardProps) => {
  const accentColor = color || 'var(--accent-primary)'

  return (
    <GlassCard
      hoverEffect={true}
      className="shadow-lg h-full group overflow-hidden relative"
    >
      <div
        className={cn(
          'absolute pointer-events-none z-0',
          '-top-[30%] -left-[80%] w-[80%] h-[80%]',
          'rounded-full blur-[80px]',
          'opacity-20 transition-opacity duration-300 group-hover:opacity-30'
        )}
        style={{ backgroundColor: accentColor }}
      />
      <div className="relative z-10 flex flex-col items-center text-center h-full w-full p-6">
        <div className="relative mb-4">
          <span className='text-4xl transition-transform duration-300 group-hover:scale-110 inline-block' style={{ color: accentColor }}>
            {icon}
          </span>
        </div>
        <MtbTypography
          variant='h5'
          customClassName='!mb-2 font-bold !text-center'
          style={{ color: accentColor }}
        >
          {title}
        </MtbTypography>

        <p className='text-secondary text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity !text-center'>
          {children}
        </p>

      </div>
    </GlassCard>
  )
}