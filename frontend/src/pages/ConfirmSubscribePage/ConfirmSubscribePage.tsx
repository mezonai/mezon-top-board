import { useEmailSubscribeControllerConfirmSubscribeQuery } from '@app/services/api/emailSubscribe/emailSubscribe';
import { RootState } from '@app/store';
import { useAppSelector } from '@app/store/hook';
import { IUserStore } from '@app/store/user';
import { Flex, Spin } from 'antd';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

const ConfirmSubscribePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user) 

  const { data, refetch } = useEmailSubscribeControllerConfirmSubscribeQuery();

  useEffect(() => {
    if (userInfo?.email) {
      refetch();
    }
  }, [userInfo?.email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInfo?.email) {
        toast.error(t('component.confirm_subscribe.email_not_found'));
        navigate('/');
      }

      if (!data) {
        toast.error(t('component.confirm_subscribe.already_confirmed'));
        navigate('/');
      } else {
        toast.success(data.message);
        navigate('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [userInfo?.email, data]);

  return (
    <Flex align='center' justify='center' vertical flex={1} className='fixed inset-0 z-[9999] bg-content'>
      <Spin size='large' />
    </Flex>
  )
}

export default ConfirmSubscribePage