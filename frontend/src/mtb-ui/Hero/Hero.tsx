import Button from '@app/mtb-ui/Button'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useTranslation } from 'react-i18next'
import screenshot from '@app/assets/images/screenshot.png'

function Hero() {
  const { t } = useTranslation(['home_page'])
  return (
    <section className='py-10 px-6 md:px-20'>
      <div className='grid grid-cols-1 xl:grid-cols-2 items-center gap-8'>
        {/* Left Section - Text Content */}
        <article>
          <header>
            <MtbTypography variant='h1'>{t('hero.title')}</MtbTypography>
            <MtbTypography variant='h1'>{t('hero.subtitle')}</MtbTypography>
          </header>
          <p className='text-secondary mt-4 leading-relaxed'>
            {t('hero.description')}
          </p>
          <div className='mt-6'>
            <Button variant='solid' color='default' size='large'>
              {t('hero.get_started')}
            </Button>
          </div>
        </article>

        {/* Right Section - Image */}
        <figure className='w-full'>
          <img
            src={screenshot}
            alt='Mezon Top Board Preview'
            className='w-full h-auto object-cover rounded-xl shadow-md'
          />
        </figure>
      </div>
    </section>
  )
}

export default Hero
