import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { Divider } from 'antd'
import StatsSection from '@app/components/StatsSection/StatsSection'
import TestimonialsSection from '@app/components/TestimonialsSection/TestimonialsSection'
import Button from '@app/mtb-ui/Button'
import mezonScreenshot from '@app/assets/images/mezon-screenshot.png'

function Main() {
  const stats = [
    { number: '10000', description: 'Community, App, & Bot Advertisers' },
    { number: '15M', description: 'Impressions per Week' },
    { number: '300%', description: 'Platform Growth' }
  ]

  const testimonials = [
    {
      title: 'Our Vision',
      type: '',
      description:
        'We aim to be the ultimate listing hub for Mezon-based applications, fostering a thriving community where ' +
        'developers and users can connect, share, and grow. By providing a structured and transparent overview of ' +
        'applications, we empower users to make informed decisions and developers to gain visibility for their projects.'
    },
    {
      title: 'What We Offer',
      type: '',
      description:
        'Curated selection of top Mezon-powered applications.\n\n' +
        'Detailed descriptions, standout features, and real-world use cases.\n\n' +
        'Ratings, reviews, and discussions that spark collaboration.\n\n' +
        'A stage to promote your projects and reach a wider audience.'
    },
    {
      title: 'Why Choose We?',
      type: '',
      description:
        'Mezon Top Board bridges the gap between users and Mezon-powered applications\n\n' +
        "Whether you're a developer seeking visibility or a user searching for the next great" +
        'app, we provide the tools, resources, and community to support your journey.'
    }
  ]

  return (
    <div className='flex flex-col justify-center pt-8 pb-12 w-[80%] m-auto'>
      <div className='flex flex-col items-center text-center mt-10'>
        <MtbTypography variant='h1'>Power your discovery and growth with Mezon Bots</MtbTypography>
        <p className='text-secondary'>
          Gain millions of impressions for your app or community on the #1 platform for bot and server discovery
        </p>
      </div>

      <StatsSection stats={stats} />
      <Divider className='bg-border' />

      <div className='flex flex-col items-center text-center mt-10'>
        <MtbTypography variant='h1'>Why Mezon Top Board? Here's Everything!</MtbTypography>
        <p className='text-secondary'>Hear from our trusted partners - our customers say it best</p>
      </div>

      <TestimonialsSection testimonials={testimonials} />
      <Divider className='bg-border' />

      <div className='flex flex-col items-center text-center mt-10'>
        <MtbTypography variant='h1'>Have we got your attention?</MtbTypography>
        <p className='text-secondary'>
          Join us in exploring the future of applications built on Mezon. Discover, engage, and innovate with Mezon Top
          Board!
        </p>
        <div className='pt-6'>
          <Button color='primary' variant='solid' size='large'>
            Get Started
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
