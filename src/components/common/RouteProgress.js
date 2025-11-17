import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

export default function RouteProgress() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => {
      NProgress.done();
    }, 400);
    return () => clearTimeout(t);
  }, [location.pathname, location.search, location.hash]);

  return null;
}
