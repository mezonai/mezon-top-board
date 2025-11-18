import { Navigate, Outlet, useLocation } from 'react-router-dom'; 
import { Spin } from 'antd';
import { useUserControllerGetUserDetailsQuery } from '@app/services/api/user/user';

function OnboardingLayout() {
  const { data: userDetailsResponse, isLoading, isFetching } = useUserControllerGetUserDetailsQuery();

  const location = useLocation(); 

  if (isLoading || isFetching) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  const isFirstLogin = userDetailsResponse?.data?.isFirstLogin;
  const pathname = location.pathname;
  const isWelcomePath = pathname.startsWith('/welcome');

  if (!isFirstLogin) {
    return isWelcomePath ? <Navigate to="/" replace /> : <Outlet />;
  }

  const isHomePath = pathname === '/';
  
  if (isWelcomePath || isHomePath) {
    return <Outlet />;
  }
  return <Navigate to="/welcome" replace />;
}

export default OnboardingLayout;