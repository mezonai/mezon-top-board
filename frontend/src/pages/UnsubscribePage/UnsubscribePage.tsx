
import { useEmailSubscribeControllerUnsubscribeQuery } from '@app/services/api/emailSubscribe/emailSubscribe';
import { RootState } from '@app/store';
import { useAppSelector } from '@app/store/hook';
import { IUserStore } from '@app/store/user';
import { Flex, Spin } from 'antd';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const UnsubscribePage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user) 
  const { data, refetch } = useEmailSubscribeControllerUnsubscribeQuery();
  const { t } = useTranslation();

  useEffect(() => {
    if (userInfo?.email) {
      refetch();
    }
  }, [userInfo?.email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInfo?.email) {
        toast.error(t('component.unsubscribe_page.failed_email'));
        navigate('/');
      }

      if (!data) {
        toast.error(t('component.unsubscribe_page.failed_already'));
        navigate('/');
      } else {
        toast.success(data.message);
        navigate('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [userInfo?.email, data]);

  return (
    <Flex align='center' justify='center' vertical flex={1} className='bg-content fixed inset-0 z-[9999]'>
      <Spin size='large' />
    </Flex>
  )
}

export default UnsubscribePage