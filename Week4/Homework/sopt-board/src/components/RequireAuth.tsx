import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { readAuth } from '../auth';

export default function RequireAuth() {
  const isAuthenticated = readAuth() !== null;
  const hasRedirected = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated || hasRedirected.current) return;

    hasRedirected.current = true;
    window.alert('회원 코드가 필요해요. 먼저 회원 코드를 발급받아주세요.');
    navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Outlet /> : null;
}
