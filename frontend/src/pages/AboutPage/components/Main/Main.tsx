import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { Divider } from 'antd'
import StatsSection from '@app/components/StatsSection/StatsSection'
import TestimonialsSection from '@app/components/TestimonialsSection/TestimonialsSection'
import Button from '@app/mtb-ui/Button'
import mezonScreenshot from '@app/assets/images/mezon-screenshot.png'

import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

function Main() {
  const { t } = useTranslation()

  const stats = useMemo(() => [
    { number: '10000', description: t('about.stats.community') },
    { number: '15M', description: t('about.stats.impressions') },
    { number: '300%', description: t('about.stats.growth') }
  ], [t])

  const testimonials = useMemo(() => [
    {
      title: t('about.vision.title'),
      type: '',
      description: t('about.vision.description')
    },
    {
      title: t('about.offer.title'),
      type: '',
      description: t('about.offer.description')
    },
    {
      title: t('about.choose_us.title'),
      type: '',
      description: t('about.choose_us.description')
    }
  ], [t])

  return (
    <div className='flex flex-col justify-center pt-8 pb-12 w-[80%] m-auto'>
      <div className='flex flex-col items-center text-center mt-10'>
        <MtbTypography variant='h1'>{t('about.hero.title')}</MtbTypography>
        <p className='text-secondary'>
          {t('about.hero.subtitle')}
        </p>
      </div>

      <StatsSection stats={stats} />
      <Divider className='bg-border' />

      <div className='flex flex-col items-center text-center mt-10'>
        <MtbTypography variant='h1'>{t('about.testimonials.title')}</MtbTypography>
        <p className='text-secondary'>{t('about.testimonials.subtitle')}</p>
      </div>

      <TestimonialsSection testimonials={testimonials} />
      <Divider className='bg-border' />

      <div className='flex flex-col items-center text-center mt-10'>
        <MtbTypography variant='h1'>{t('about.cta.title')}</MtbTypography>
        <p className='text-secondary'>
          {t('about.cta.description')}
        </p>
        <div className='pt-6'>
          <Button color='primary' variant='solid' size='large'>
            {t('about.cta.button')}
          </Button>
        </div>
      </div>
      <div className='flex flex-col items-center pt-10'>
        <img
          src={mezonScreenshot}
          alt='Mezon screenshot'
          className='w-full max-w-[600px] object-cover rounded-xl shadow-xl'
        />
      </div>
    </div>
  )
}

export default Main
