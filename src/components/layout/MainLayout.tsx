import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import LeftNaviBar from '@/components/common/LeftNavBar';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const isAuthPage =
    router.pathname === '/login' || router.pathname === '/signup';
  const isMainPage = router.pathname === '/';
  const isActivityPage = /^\/activity\/[^/]+$/.test(router.pathname);

  if (isAuthPage) {
    return <main className="flex-1">{children}</main>;
  }

  if (isMainPage) {
    return (
      <div className="kv-layout-root">
        <div className="layout-content-wrapper">
          <div className="layout-header-wrapper">
            <Header />
          </div>
          <div className="layout-header-spacer" />
          <main className="min-h-[1060px] flex-1 bg-kv-gray-100">
            {children}
          </main>
          <div className="layout-content-margin-bottom" />
          <Footer />
        </div>
      </div>
    );
  }

  if (isActivityPage) {
    return (
      <div className="kv-layout-root">
        <div className="layout-content-wrapper">
          <div className="layout-header-wrapper">
            <Header />
          </div>
          <div className="layout-header-spacer" />
          <div
            style={{
              height:
                'min(72px, calc(24px + (72 - 24) * ((100vw - 1200px) / (1920 - 1200))))',
            }}
            className="layout-content-margin-top"
          />
          <div className="align-center">
            <div className="layout-content-container">
              <main className="min-h-[1060px] flex-1 bg-kv-gray-100">
                {children}
              </main>
            </div>
          </div>
          <div className="layout-content-margin-bottom" />
          <Footer />
        </div>
      </div>
    );
  }

  /* myPage */
  return (
    <div className="kv-layout-root">
      <div className="layout-content-wrapper">
        <div className="layout-header-wrapper">
          <Header />
        </div>
        <div className="layout-header-spacer" />
        <div
          style={{
            height:
              'min(72px, calc(24px + (72 - 24) * ((100vw - 1200px) / (1920 - 1200))))',
          }}
          className="layout-content-margin-top"
        />
        <div className="bg-kv-gray-100 align-center">
          <div className="layout-content-container">
            <div className="mr-6 hidden pc:block tablet:block">
              <LeftNaviBar />
            </div>
            <main className="min-h-[1060px] flex-1 bg-kv-gray-100">
              {children}
            </main>
          </div>
        </div>
        <div className="layout-content-margin-bottom" />
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
