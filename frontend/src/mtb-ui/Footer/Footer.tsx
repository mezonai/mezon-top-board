import { Button, Divider, Form, Input, Modal, Tag } from 'antd'
import { renderMenu } from '@app/navigation/router'
import MtbTypography from '../Typography/Typography'
import { FacebookFilled, InstagramOutlined, XOutlined, YoutubeFilled } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import { RootState } from '@app/store'
import { useEmailSubscribeControllerReSubscribeMutation, useEmailSubscribeControllerSendConfirmMailMutation } from '@app/services/api/emailSubscribe/emailSubscribe'
import { EmailSubscriptionStatus } from '@app/enums/subscribe'

const footerLink = [
  {
    icon: <FacebookFilled />,
    link: 'https://www.facebook.com/mezonworld'
  },
  {
    icon: <XOutlined />,
    link: 'https://x.com/mezonworld'
  },
  {
    icon: <InstagramOutlined />,
    link: 'https://www.instagram.com/'
  },
  {
    icon: <YoutubeFilled />,
    link: 'https://www.youtube.com/@nccplusvietnam7545'
  }
]
function Footer() {
  const [sendMail, { isLoading }] = useEmailSubscribeControllerSendConfirmMailMutation()
  const [updateStatus] = useEmailSubscribeControllerReSubscribeMutation()
  const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = userInfo?.email
    if (!email) {
      toast.error('Please log in to subscribe to the newsletter.')
      return
    }
    const res = await sendMail({ email }).unwrap().catch((err) => {
      const message = err?.data?.message || 'An error occurred.';
    
      if (message.includes('unsubscribed')) {
        Modal.confirm({
          title: 'Resubscribe?',
          content: 'You have unsubscribed from our newsletter. Would you like to subscribe again?',
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
            const resub = await updateStatus({
                updateSubscriptionRequest: { status: EmailSubscriptionStatus.ACTIVE }
              }).unwrap().catch((error) => {
                const errMessage = error?.data?.message || 'Failed to resubscribe. Please try again later..';
                toast.error(errMessage);
                throw error;
              });
              toast.success(resub.message);
          },
        });
      } else {
        toast.info(message);
      }
    })
    if (res?.statusCode === 200) {
      toast.success(res.message)
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
       <div className="flex flex-col md:flex-row gap-4 items-center justify-center text-center md:text-left">
          <MtbTypography
            variant="h5"
            customClassName="!mb-0 !text-gray-600"
          >
            Get Newsletter
          </MtbTypography>
          <div className="flex items-center justify-center gap-2 w-full md:w-auto">
            <Form className="flex-grow max-w-sm">
              <Form.Item className="!mb-0">
                <Input className="text-center md:text-left" readOnly disabled value={userInfo?.email || ""} />
              </Form.Item>
            </Form>
            <Button
              className="!bg-black !text-white !border-black hover:!bg-gray-800 hover:!border-gray-800 rounded-md px-4 py-2 transition-all"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Subscribe'}
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
