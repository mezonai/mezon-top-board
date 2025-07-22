
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      fetch('http://localhost:8123/api/subscriber/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(() => {
          setStatus('success');
          setTimeout(() => navigate('/'), 3000);
        })
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', paddingTop: 100 }}>
        {status === 'loading' && <p>Verifying your email...</p>}
        {status === 'success' && <p>Email confirmed! You will be redirected to the homepage.</p>}
        {status === 'error' && <p>The confirmation link has expired or is invalid.</p>}
    </div>
  );
}
