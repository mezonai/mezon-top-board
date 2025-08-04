
import { useSubscriberControllerConfirmEmailMutation } from '@app/services/api/subscriber/subscriber';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ConfirmEmailPage() {
   const [confirmEmail] = useSubscriberControllerConfirmEmailMutation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();
 useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    confirmEmail({ token })
      .unwrap()
      .then(() => {
        setStatus('success');
        setTimeout(() => navigate('/'), 1000);
      })
      .catch(() => {
        setStatus('error');
      });
  }, [confirmEmail, searchParams, navigate]);

  return (
    <div style={{ textAlign: 'center', paddingTop: 100 }}>
        {status === 'loading' && <p>Verifying your email...</p>}
        {status === 'success' && <p>Email confirmed! You will be redirected to the homepage.</p>}
        {status === 'error' && <p>The confirmation link has expired or is invalid.</p>}
    </div>
  );
}
