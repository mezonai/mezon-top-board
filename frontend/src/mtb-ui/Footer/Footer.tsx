import { Divider, Input, message, Tag } from 'antd'
import { renderMenu } from '@app/navigation/router'
import Button from '@app/mtb-ui/Button'
import MtbTypography from '../Typography/Typography'
import { FacebookFilled, InstagramOutlined, TwitterOutlined, YoutubeFilled } from '@ant-design/icons'
import { useSubscriberControllerSubscribeMutation } from '@app/services/api/subscriber/subscriber'
import { useState } from 'react'
import { toast } from 'react-toastify'
const footerLink = [
  {
    icon: <FacebookFilled />,
    link: 'https://www.facebook.com/mezonworld'
  },
  {
    icon: <TwitterOutlined />,
    link: 'https://x.com/mezonworld'
  },
  {
    icon: <InstagramOutlined />,
    link: 'https://www.instagram.com/'
  },
  {
    icon: <YoutubeFilled />,
    link: 'https://www.youtube.com/'
  }
]
function Footer() {
  const [email, setEmail] = useState('')
  const [subscribe, { isLoading }] = useSubscriberControllerSubscribeMutation()
  const handleSubscribe = async () => {
    if (!email) return message.warning('Please enter your email')
    try {
      await subscribe({ email }).unwrap()
      toast.success('Subscribed successfully')
      setEmail('')
    } catch (error: any) {
      message.error(error?.data?.message || 'Subscribe failed')
    }
  }

  return (
    <div className='pt-10 pb-5 bg-gray-100'>
      <div className={`flex flex-col md:flex-row justify-around items-center gap-6 md:gap-0 pb-8 px-4`}>
        {/* Follow us section */}
        <div className='flex flex-col md:flex-row gap-4 items-center text-center md:text-left'>
          <MtbTypography variant='h5' customClassName='!mb-0 !text-gray-600'>Follow us</MtbTypography>
          <div className="flex gap-2">
          {footerLink.map((item, index) => (
            <Tag key={index} className='!rounded-full !w-12 !h-12 !flex !items-center !justify-center !bg-gray-300 !text-lg cursor-pointer hover:!bg-gray-100' onClick={() => window.open(item.link, '_blank')}>
              {item.icon}
            </Tag>
          ))}
          </div>
        </div>
        {/* Newsletter section */}
        <div className='flex flex-col md:flex-row gap-4 items-center text-center md:text-left'>
          <MtbTypography variant='h5' customClassName='!mb-0 !text-gray-600'>Get Newsletter</MtbTypography>
          <div className='flex w-full md:w-auto'>
            <Input
              type='email'
              placeholder='Your email address'
              className="border border-gray-300 px-3 py-2 w-full md:w-auto"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Button
              color='default'
              variant='solid'
              customClassName='!bg-black !text-white !border-black !rounded-none opacity-100 hover:opacity-75 !py-5'
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <Divider className='bg-gray-400' />
      <ul className='flex justify-center pt-10 gap-6'>{renderMenu(false)}</ul>
      <div className='flex flex-col items-center pt-8 gap-2 '>
        <MtbTypography variant='p' customClassName='!mb-0 !text-gray-600 text-center max-md:mx-12' weight='normal'>Address: 2nd Floor, CT3 The Pride, To Huu st, Ha Dong District, Ha Noi City, Viet Nam</MtbTypography>
        <MtbTypography variant='p' customClassName='!mb-0 !text-gray-600' weight='normal'>(+84) 2466874606</MtbTypography>
      </div>
    </div>
  )
}

export default Footer
