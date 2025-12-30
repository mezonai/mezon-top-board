import Button from '@app/mtb-ui/Button';
import { Result } from 'antd';
import { useNavigate } from 'react-router-dom';


import { useTranslation } from 'react-i18next';
const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Result
        status="404"
        title={<div className="text-primary">{t('component.not_found_page.title')}</div>}
        subTitle={<div className="text-secondary">{t('component.not_found_page.subtitle')}</div>}
        extra={
          <Button color='primary' variant='solid' size='large' 
            onClick={() => {navigate('/'); window.scrollTo(0, 0);} }>
            {t('component.not_found_page.back_home')}
          </Button>
        }
      />
    </div>
  );
};


export default NotFoundPage;

