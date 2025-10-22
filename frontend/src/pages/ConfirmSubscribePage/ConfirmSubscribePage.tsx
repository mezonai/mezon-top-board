import { useEmailSubscribeControllerConfirmQuery } from '@app/services/api/emailSubscriber/emailSubscriber';
import { Flex, Spin } from 'antd';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ConfirmSubscribePage = () => {
  const navigate = useNavigate();

  const { token } = useParams<{ token: string }>()

  const { data } = useEmailSubscribeControllerConfirmQuery(token!, {
    skip: !token,
  })

  useEffect(() => {
    console.log(data)
    if(!data) {
      toast.error("Subscription confirmation failed\nInvalid token or subscription already confirmed.");
      navigate(`/`);
    }else{
      toast.success("Subscription confirmed successfully");
      navigate(`/`);
    }
  }, [navigate, data]);

  return (
    <Flex align='center' justify='center' vertical flex={1} className='!bg-gray-300 fixed inset-0 z-[9999]'>
      <Spin size='large' />
    </Flex>
  )
}

export default ConfirmSubscribePage