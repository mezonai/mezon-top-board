import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep1 from './components/OnboardingStep1';
import OnboardingStep2 from './components/OnboardingStep2';

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleOnboardingComplete = () => {
    navigate('/', { replace: true });
  };

  const handleSkip = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-6'>
      <div className={`bg-white p-8 rounded-xl shadow-lg w-full ${step === 1 ? 'max-w-4xl' : 'max-w-2xl'}`}>
        {step === 1 && (
          <OnboardingStep1
            onSkip={handleSkip}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <OnboardingStep2 
            onSubmitSuccess={handleOnboardingComplete} 
          />
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;