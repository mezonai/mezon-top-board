import { FeatureCardProps } from './FeatureCard.types';
import MtbTypography from '@app/mtb-ui/Typography/Typography';
import { cn } from '@app/utils/cn'

export const FeatureCard = ({ icon, title, children, color }: FeatureCardProps) => {
  const accentColor = color || 'var(--color-primary)'

  return (
    <div
      className={cn(
        'card-base',
        'p-6 rounded-lg shadow-sm flex flex-col items-center text-center h-full',
        'hover:shadow-lg transition-shadow cursor-default'
      )}
    >
      <span className='text-3xl' style={{ color: accentColor }}>{icon}</span>
      <MtbTypography
        variant='h5'
        customClassName='mt-4 !mb-1 font-semibold'
        style={{ color: accentColor }}
      >
        {title}
      </MtbTypography>
      <p className='text-secondary text-sm'>{children}</p>
    </div>
  )
}