import { Outlet } from 'react-router-dom';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ScrollToTop from '@/components/shared/ScrollToTop';

export const Layout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
