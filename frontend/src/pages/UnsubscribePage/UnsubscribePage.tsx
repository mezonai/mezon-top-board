
import { useEmailSubscribeControllerUnsubscribeQuery } from '@app/services/api/emailSubscribe/emailSubscribe';
import { RootState } from '@app/store';
import { useAppSelector } from '@app/store/hook';
import { IUserStore } from '@app/store/user';
import { Flex, Spin } from 'antd';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UnsubscribePage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user) 
  const { data, refetch } = useEmailSubscribeControllerUnsubscribeQuery();

  useEffect(() => {
    if (userInfo?.email) {
      refetch();
    }
  }, [userInfo?.email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInfo?.email) {
        toast.error("Unsubscribe failed\nEmail not found, please log in.");
        navigate('/');
      }

      if (!data) {
        toast.error("Unsubscribe failed\nUnsubscribed already.");
        navigate('/');
      } else {
        toast.success(data.message);
        navigate('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [userInfo?.email, data]);

  return (
    <Flex align='center' justify='center' vertical flex={1} className='!bg-gray-300 fixed inset-0 z-[9999]'>
      <Spin size='large' />
    </Flex>
  )
}

export default UnsubscribePage