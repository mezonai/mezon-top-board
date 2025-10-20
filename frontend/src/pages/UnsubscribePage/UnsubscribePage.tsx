import { Flex, Spin } from 'antd';
import { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UnsubscribePage = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (status === "failed") {
        toast.error(message ?? "Unsubscribe failed, please try again");
        navigate(`/`);
    } else if (status === "success") {
        toast.success(message ?? "Unsubscribe successful");
        navigate(`/`);
      }
  }, [navigate, status, message]);

  return (
    <Flex align='center' justify='center' vertical flex={1} className='!bg-gray-300 fixed inset-0 z-[9999]'>
      <Spin size='large' />
    </Flex>
  )
}

export default UnsubscribePage