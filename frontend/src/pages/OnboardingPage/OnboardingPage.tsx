import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@app/store/hook';
import { RootState } from '@app/store';
import { IUserStore } from '@app/store/user';
import { Spin } from 'antd';
import OnboardingStep1 from './components/OnboardingStep1';
import OnboardingStep2 from './components/OnboardingStep2';
import { GlassCard } from '@app/components/GlassCard/GlassCard'; 

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user);

  const isUserLoaded = !!userInfo?.id;
  const isFirstLogin = userInfo?.isFirstLogin;

  if (isUserLoaded && isFirstLogin === false) {
    navigate('/', { replace: true });
    return null; 
  }

  if (!isUserLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center p-6'>
        <Spin size='large' />
      </div>
    );
  }

  const handleSkip = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <GlassCard 
        className={`w-full transition-all duration-500 ${step === 1 ? 'max-w-5xl' : 'max-w-2xl'}`}
      >
        <div className="p-8 md:p-10">
          {step === 1 && (
            <OnboardingStep1
              onSkip={handleSkip}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <OnboardingStep2 
              onSubmitSuccess={handleSkip} 
            />
          )}
        </div>
      </GlassCard>
    </div>
  );
}

export default OnboardingPage;