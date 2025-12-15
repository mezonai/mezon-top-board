import { SyncOutlined } from '@ant-design/icons'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import Button from '@app/mtb-ui/Button'
import { useState } from 'react'

function HelpPage() {
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
          <MtbTypography variant='h2'>Contact Us</MtbTypography>
          <span className="absolute left-1/2 bottom-[-16px] w-28 h-[3px] bg-secondary -translate-x-1/2"></span>
        </header>
        <section className='flex flex-col lg:flex-row lg:gap-36 xl:mx-12 xl:mr-20'>
          {/* Form */}
          <form action='' className='bg-bg-secondary dark:bg-bg-container p-6 w-full lg:w-1/2 rounded-xl shadow-md border border-transparent dark:border-border transition-colors duration-300'>
            <MtbTypography variant='h4' label='Send us a message' />
            <div className='flex gap-4 mb-4'>
              <input type='text' placeholder='Your name' className='w-1/2 p-2 rounded bg-bg-body dark:bg-bg-container-secondary text-text-primary border border-transparent dark:border-border placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary' required />
              <input type='email' placeholder='Your email' className='w-1/2 p-2 rounded bg-bg-body dark:bg-bg-container-secondary text-text-primary border border-transparent dark:border-border placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary' required />
            </div>
            <textarea placeholder='Information' className='w-full p-2 rounded bg-bg-body dark:bg-bg-container-secondary text-text-primary border border-transparent dark:border-border placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary mb-4 h-24' required></textarea>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Verification code"
                className="p-2 rounded w-2/3 bg-bg-body dark:bg-bg-container-secondary text-text-primary border border-transparent dark:border-border placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
              <div className="flex items-center justify-around p-2 rounded-xs w-1/3 text-center font-bold relative">
                <span className='inline-block'>{captcha}</span>
                <button type="button" onClick={refreshCaptcha} className="absolute right-1 top-1/2 -translate-y-1/2 max-[400px]:-right-2.5">
                  <SyncOutlined className="text-text-tertiary hover:text-text-primary transition text-sm cursor-pointer" />
                </button>
              </div>
            </div>
            <div className='text-center'>
              <Button variant='submit' size='large'>
                Submit
              </Button>
            </div>
          </form>

          {/* Content */}
          <div className='w-full lg:w-1/2 p-6 max-lg:mt-6'>
            <p>
              Thank you for your interest in Mezon Top Board. To receive further information, please send an email to
              <span className='text-primary font-bold'> sales@ncc.asia</span> Or call us
              directly (+84) 2466874606.
            </p>
            <h5 className='mt-8 mb-1.5'>
              You might also join our support clan on Mezon - <strong>TOP MEZON SUPPORT</strong> at: <a href="https://mezon.ai/invite/1840680946488053760" className='text-primary font-bold' target='_blank'>https://mezon.ai/invite/1840680946488053760</a>
            </h5>
            <p className='mt-8'>
              <div className='mb-1.5'>
                <strong>Contact Information: </strong>
              </div>
              <div className='mb-1.5'>
                <strong>Address: </strong>
                2nd Floor, CT3 The Pride, To Huu st, Ha Dong District, Ha Noi City, Viet Nam
              </div>
              <div className='mb-1.5'>
                <strong>Telephone: </strong>
                (+84) 2466874606
              </div>
              <strong>Email: </strong>
              sales@ncc.asia
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
