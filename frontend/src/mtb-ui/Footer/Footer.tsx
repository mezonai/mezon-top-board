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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const [sendMail, { isLoading }] = useEmailSubscribeControllerSendConfirmMailMutation()
  const [updateStatus] = useEmailSubscribeControllerReSubscribeMutation()
  const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = userInfo?.email
    if (!email) {
      toast.error(t('footer.login_required'))
      return
    }
    const res = await sendMail({ email }).unwrap().catch((err) => {
      const message = err?.data?.message || t('footer.error_occurred');

      if (message.includes('unsubscribed')) {
        Modal.confirm({
          title: t('footer.resubscribe_title'),
          content: t('footer.resubscribe_content'),
          okText: t('footer.yes'),
          cancelText: t('footer.no'),
          onOk: async () => {
            const resub = await updateStatus({
                updateSubscriptionRequest: { status: EmailSubscriptionStatus.ACTIVE }
              }).unwrap().catch((error) => {
                const errMessage = error?.data?.message || t('footer.resubscribe_failed');
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
    <div className='pt-10 pb-5 transition-colors bg-secondary'>
      <div className='flex flex-col md:flex-row justify-around items-center gap-6 md:gap-0 pb-8 px-4'>
        {/* Follow us section */}
        <div className='flex flex-col md:flex-row gap-4 items-center text-center md:text-left'>
          <MtbTypography variant='h5' customClassName='!mb-0 text-secondary'>{t('footer.follow_us')}</MtbTypography>
          <div className='flex gap-2'>
          {footerLink.map((item, index) => (
            <Tag
              key={index}
              className={cn(
                '!rounded-full !w-12 !h-12 !flex !items-center !justify-center',
                '!bg-container-secondary !text-lg',
                'cursor-pointer transition-colors',
                'hover:!bg-container'
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
            customClassName="!mb-0 text-secondary"
            label={t('footer.get_newsletter')}
          />
          <div className='flex items-center justify-center gap-2 w-full md:w-auto'>
            <Form className='flex-grow max-w-sm'>
              <Form.Item className="!mb-0">
                <Input
                  className={cn(
                    'text-center md:text-left',
                    '!bg-container !text-primary !border-transparent',
                    'dark:!border-border',
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
              {isLoading ? t('footer.sending') : t('footer.subscribe')}
            </Button>
          </div>
        </div>
      </div>
      <Divider className='bg-body dark:bg-border' />
      <ul className='flex justify-center pt-10 gap-6'>{renderMenu(false)}</ul>
      <div className='flex flex-col items-center pt-8 gap-2'>
        <MtbTypography
          variant='p'
          customClassName='!mb-0 text-secondary text-center max-md:mx-12'
          weight='normal'
          label={t('footer.address')}
        />
        <MtbTypography
          variant='p'
          customClassName='!mb-0 text-secondary'
          weight='normal'
          label='(+84) 2466874606'
        />
      </div>
    </div>
  )
}

export default Footer
