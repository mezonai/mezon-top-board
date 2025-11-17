import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { useUserControllerGetUserDetailsQuery } from '@app/services/api/user/user';

function OnboardingGuard() {
  const { data: userDetailsResponse, isLoading, isFetching } = useUserControllerGetUserDetailsQuery();

  if (isLoading || isFetching) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  //TODO: uncomment when onboarding flow is ready
  // const isFirstLogin = userDetailsResponse?.data?.isFirstLogin;
  const isFirstLogin = false; 

  if (isFirstLogin) {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}

export default OnboardingGuard;