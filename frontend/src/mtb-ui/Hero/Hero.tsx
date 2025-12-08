import Button from '@app/mtb-ui/Button'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import screenshot from '@app/assets/images/screenshot.png'

function Hero() {
  return (
    <section className='bg-[var(--bg-container-secondary)] py-10 px-6 md:px-20'>
      <div className='grid grid-cols-1 xl:grid-cols-2 items-center gap-8'>
        {/* Left Section - Text Content */}
        <article>
          <header>
            <MtbTypography variant='h1'>Mezon Top Board</MtbTypography>
            <MtbTypography variant='h1'>#1 Bot Listing for Mezon</MtbTypography>
          </header>
          <p className='text-gray-500 mt-4 leading-relaxed'>
            Welcome to Mezon Top Board, your go-to platform for discovering the best applications built on the Mezon
            ecosystem. Our mission is to curate and showcase top-tier applications that leverage Mezon's cutting-edge
            technology, helping users and developers explore innovative solutions with ease.
          </p>
          <div className='mt-6'>
            <Button color='default' variant='solid' size='large'>
              Get Started
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
