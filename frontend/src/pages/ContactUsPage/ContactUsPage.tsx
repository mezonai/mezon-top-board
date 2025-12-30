import { SyncOutlined } from '@ant-design/icons'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import Button from '@app/mtb-ui/Button'
import { useState } from 'react'

import { useTranslation } from "react-i18next";

function HelpPage() {
  const { t } = useTranslation();
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase() // Generates a 6-char code
  }

  function refreshCaptcha() {
    setCaptcha(generateCaptcha()) // Generates a new captcha
  }
  return (
    <main className='p-6'>
      <div className="container m-auto mt-2 pb-3">
        <header className='relative mb-10 flex justify-center'>
          <MtbTypography variant='h2'>{t('contact.title')}</MtbTypography>
          <span className="absolute left-1/2 bottom-[-16px] w-28 h-[3px] bg-heading -translate-x-1/2"></span>
        </header>
        <section className='flex flex-col lg:flex-row lg:gap-36 xl:mx-12 xl:mr-20'>
          {/* Form */}
          <form action='' className='bg-secondary dark:bg-container p-6 w-full lg:w-1/2 rounded-xl shadow-md border border-transparent dark:border-border transition-colors duration-300'>
            <MtbTypography variant='h4' label={t('contact.form.title')} />
            <div className='flex gap-4 mb-4'>
              <input type='text' placeholder={t('contact.form.name_placeholder')} className='w-1/2 p-2 rounded bg-body dark:bg-container-secondary text-primary border border-transparent dark:border-border placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary' required />
              <input type='email' placeholder={t('contact.form.email_placeholder')} className='w-1/2 p-2 rounded bg-body dark:bg-container-secondary text-primary border border-transparent dark:border-border placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary' required />
            </div>
            <textarea placeholder={t('contact.form.info_placeholder')} className='w-full p-2 rounded bg-body dark:bg-container-secondary text-primary border border-transparent dark:border-border placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary mb-4 h-24' required></textarea>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder={t('contact.form.captcha_placeholder')}
                className="p-2 rounded w-2/3 bg-body dark:bg-container-secondary text-primary border border-transparent dark:border-border placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
              <div className="flex items-center justify-around p-2 rounded-xs w-1/3 text-center font-bold relative">
                <span className='inline-block'>{captcha}</span>
                <button type="button" onClick={refreshCaptcha} className="absolute right-1 top-1/2 -translate-y-1/2 max-[400px]:-right-2.5">
                  <SyncOutlined className="text-tertiary hover:text-primary transition text-sm cursor-pointer" />
                </button>
              </div>
            </div>
            <div className='text-center'>
              <Button variant='submit' size='large'>
                {t('contact.form.submit_btn')}
              </Button>
            </div>
          </form>

          {/* Content */}
          <div className='w-full lg:w-1/2 p-6 max-lg:mt-6'>
            <p>
              {t('contact.content.intro')}
              <span className='text-heading font-bold'> {t('contact.content.email_value')}</span> {t('contact.content.or_call')}{" "}
              {t('contact.content.phone_value')}.
            </p>
            <h5 className='mt-8 mb-1.5'>
              {t('contact.content.join_support')} <strong>{t('contact.content.support_clan_name')}</strong> {t('contact.content.at')} <a href="https://mezon.ai/invite/1840680946488053760" className='text-heading font-bold' target='_blank'>https://mezon.ai/invite/1840680946488053760</a>
            </h5>
            <p className='mt-8'>
              <div className='mb-1.5'>
                <strong>{t('contact.content.info_title')} </strong>
              </div>
              <div className='mb-1.5'>
                <strong>{t('contact.content.address_title')} </strong>
                {t('contact.content.address_value')}
              </div>
              <div className='mb-1.5'>
                <strong>{t('contact.content.phone_title')} </strong>
                {t('contact.content.phone_value')}
              </div>
              <strong>{t('contact.content.email_title')} </strong>
              {t('contact.content.email_value')}
            </p>
          </div>
        </section>
        <section className="mt-10 xl:mx-12">
          <iframe
            className="w-full h-[300px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10537.271707453767!2d105.75122421087973!3d20.97306114448466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313453005f0a4af7%3A0x79f302eac922779!2sCT3%20The%20Pride!5e0!3m2!1svi!2s!4v1744975282811!5m2!1svi!2s"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>

      </div>
    </main>
  )
}

export default HelpPage
