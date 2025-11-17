import { FeatureCardProps } from './FeatureCard.types';
import MtbTypography from '@app/mtb-ui/Typography/Typography';

export const FeatureCard = ({ icon, title, children, color }: FeatureCardProps) => {
  const accentColor = color || 'var(--color-primary)';
  return (
    <div
      className='bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center h-full hover:shadow-lg transition-shadow cursor-default'
      style={{ borderColor: 'rgba(242,56,90,0.2)' }}
    >
      <span className='text-3xl' style={{ color: accentColor }}>{icon}</span>
      <MtbTypography
        variant='h5'
        customClassName='mt-4 !mb-1 font-semibold'
        style={{ color: accentColor }}
      >
        {title}
      </MtbTypography>
      <p className='text-gray-600 text-sm'>{children}</p>
    </div>
  );
};