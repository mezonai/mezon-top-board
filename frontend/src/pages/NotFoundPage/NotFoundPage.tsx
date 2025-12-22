import Button from '@app/mtb-ui/Button';
import { Result } from 'antd';
import { useNavigate } from 'react-router-dom';


const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Result
        status="404"
        title={<div className="text-primary">404</div>}
        subTitle={<div className="text-secondary">This page is not available.</div>}
        extra={
          <Button color='primary' variant='solid' size='large' 
            onClick={() => {navigate('/'); window.scrollTo(0, 0);} }>
            Back Home
          </Button>
        }
      />
    </div>
  );
};


export default NotFoundPage;

