import { Divider, Form, Input, Modal, Tag } from 'antd'
import Button from '@app/mtb-ui/Button'
import { renderMenu } from '@app/navigation/router'
import MtbTypography from '../Typography/Typography'
import { FacebookFilled, InstagramOutlined, XOutlined, YoutubeFilled } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import { RootState } from '@app/store'
import { useEmailSubscribeControllerReSubscribeMutation, useEmailSubscribeControllerSendConfirmMailMutation } from '@app/services/api/emailSubscribe/emailSubscribe'
import { EmailSubscriptionStatus } from '@app/enums/subscribe'
import { cn } from '@app/utils/cn'

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
    <div className='pt-10 pb-5 transition-colors bg-bg-secondary'>
      <div className='flex flex-col md:flex-row justify-around items-center gap-6 md:gap-0 pb-8 px-4'>
        {/* Follow us section */}
        <div className='flex flex-col md:flex-row gap-4 items-center text-center md:text-left'>
          <MtbTypography variant='h5' customClassName='!mb-0 text-text-secondary'>Follow us</MtbTypography>
          <div className='flex gap-2'>
          {footerLink.map((item, index) => (
            <Tag
              key={index}
              className={cn(
                '!rounded-full !w-12 !h-12 !flex !items-center !justify-center',
                '!bg-bg-container-secondary !text-lg',
                'cursor-pointer transition-colors',
                'hover:!bg-bg-container'
              )}
              onClick={() => window.open(item.link, '_blank')}
            >
              {item.icon}
            </Tag>
          ))}
          </div>
        </div>
        {/* Newsletter section */}
       <div className='flex flex-col md:flex-row gap-4 items-center justify-center text-center md:text-left'>
          <MtbTypography
            variant="h5"
            customClassName="!mb-0 text-text-secondary"
            label="Get Newsletter"
          />
          <div className='flex items-center justify-center gap-2 w-full md:w-auto'>
            <Form className='flex-grow max-w-sm'>
              <Form.Item className="!mb-0">
                <Input
                  className={cn(
                    'text-center md:text-left',
                    '!bg-bg-container !text-text-primary !border-transparent',
                    'dark:!border-border'
                  )}
                  readOnly
                  disabled
                  value={userInfo?.email || ""}
                />
              </Form.Item>
            </Form>
            <Button
              color="default"
              variant="solid"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Subscribe'}
            </Button>
          </div>
        </div>
      </div>
      <Divider className='bg-border' />
      <ul className='flex justify-center pt-10 gap-6'>{renderMenu(false)}</ul>
      <div className='flex flex-col items-center pt-8 gap-2'>
        <MtbTypography
          variant='p'
          customClassName='!mb-0 text-text-secondary text-center max-md:mx-12'
          weight='normal'
          label='Address: 2nd Floor, CT3 The Pride, To Huu st, Ha Dong District, Ha Noi City, Viet Nam'
        />
        <MtbTypography
          variant='p'
          customClassName='!mb-0 text-text-secondary'
          weight='normal'
          label='(+84) 2466874606'
        />
      </div>
    </div>
  )
}

export default Footer
