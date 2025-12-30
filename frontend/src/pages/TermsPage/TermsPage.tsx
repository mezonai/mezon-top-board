import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

type Props = {
  title: string
  children?: ReactNode
}

function TermsPage() {
  const { t } = useTranslation()
  const Section = ({ title, children }: Props) => (
    <div className='mt-8'>
      <MtbTypography variant='h3'>{title}</MtbTypography>
      <div className='mt-2 space-y-2'>{children}</div>
    </div>
  )

  const SubSection = ({ title, children }: Props) => (
    <div className='mt-4'>
      <MtbTypography variant='h5'>{title}</MtbTypography>
      <div className='mt-2'>{children}</div>
    </div>
  )
  const insertDate = '2025-03-07'
  const insertJurisdiction = '.....'
  const contactEmail = 'mezon@....'
  return (
    <div className='pt-8 pb-12 w-[75%] m-auto'>
      <MtbTypography variant='h1'>{t('terms.title')}</MtbTypography>
      <p>{t('terms.last_updated', { date: insertDate })}</p>
      <p>
        {t('terms.intro')}
      </p>
      <Section title={t('terms.section1.title')}>
        <ul className='list-disc ml-10'>
          <li>{t('terms.section1.items.0')}</li>
          <li>{t('terms.section1.items.1')}</li>
          <li>{t('terms.section1.items.2')}</li>
          <li>{t('terms.section1.items.3')}</li>
        </ul>
      </Section>
      <Section title={t('terms.section2.title')}>
        <SubSection title={t('terms.section2.sub1.title')}>
          <p>
            {t('terms.section2.sub1.content')}
          </p>
        </SubSection>
        <SubSection title={t('terms.section2.sub2.title')}>
          <ul className='list-disc ml-10'>
            <li>{t('terms.section2.sub2.items.0')}</li>
            <li>{t('terms.section2.sub2.items.1')}</li>
            <li>{t('terms.section2.sub2.items.2')}</li>
          </ul>
        </SubSection>
        <SubSection title={t('terms.section2.sub3.title')}>
          <p>{t('terms.section2.sub3.intro')}</p>
          <ul className='list-disc ml-10'>
            <li>{t('terms.section2.sub3.items.0')}</li>
            <li>{t('terms.section2.sub3.items.1')}</li>
            <li>{t('terms.section2.sub3.items.2')}</li>
            <li>{t('terms.section2.sub3.items.3')}</li>
          </ul>
        </SubSection>
      </Section>
      <Section title={t('terms.section3.title')}>
        <SubSection title={t('terms.section3.sub1.title')}>
          <ul className='list-disc ml-10'>
            <li>{t('terms.section3.sub1.items.0')}</li>
            <li>{t('terms.section3.sub1.items.1')}</li>
          </ul>
        </SubSection>
        <SubSection title={t('terms.section3.sub2.title')}>
          <ul className='list-disc ml-10'>
            <li>{t('terms.section3.sub2.items.0')}</li>
            <li>{t('terms.section3.sub2.items.1')}</li>
          </ul>
        </SubSection>
      </Section>
      <Section title={t('terms.section4.title')}>
        <ul className='list-disc ml-10'>
          <li>{t('terms.section4.items.0')}</li>
          <li>{t('terms.section4.items.1')}</li>
          <li>{t('terms.section4.items.2')}</li>
        </ul>
      </Section>
      <Section title={t('terms.section5.title')}>
        <ul className='list-disc ml-10'>
          <li>{t('terms.section5.items.0')}</li>
          <li>{t('terms.section5.items.1')}</li>
          <li>{t('terms.section5.items.2')}</li>
        </ul>
      </Section>
      <Section title={t('terms.section6.title')}>
        <ul className='list-disc ml-10'>
          <li>
            {t('terms.section6.items.0')}
          </li>
          <li>{t('terms.section6.items.1')}</li>
        </ul>
      </Section>
      <Section title={t('terms.section7.title')}>
        <p>
          {t('terms.section7.content')}
        </p>
      </Section>
      <Section title={t('terms.section8.title')}>
        <p>
          {t('terms.section8.content')}
        </p>
      </Section>
      <Section title={t('terms.section9.title')}>
        <p>{t('terms.section9.content', { jurisdiction: insertJurisdiction })}</p>
      </Section>
      <Section title={t('terms.section10.title')}>
        <p>{t('terms.section10.content', { email: contactEmail })}</p>
      </Section>
    </div>
  )
}

export default TermsPage
