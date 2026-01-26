import useScrollToTop from '@app/hook/useScrollToTop';
import useWebTitle from '@app/hook/useWebTitle';
import Footer from '@app/mtb-ui/Footer/Footer'
import Header from '@app/mtb-ui/Header/Header'
import { Outlet } from 'react-router-dom'
import LuckyButton from '../LuckyButton/LuckyButton';

function RootLayout() {
  useWebTitle();
  useScrollToTop();

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="absolute top-0 left-0 w-full h-screen -z-10 pointer-events-none overflow-hidden inset-0 opacity-20 dark:opacity-30"
        style={{
          background: 'linear-gradient(170deg, var(--accent-primary) 0%, transparent 50%)',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)'
        }}
      />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <LuckyButton />
    </div>
  )
}

export default RootLayout