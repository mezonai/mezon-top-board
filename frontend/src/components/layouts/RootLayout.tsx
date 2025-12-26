import useScrollToTop from '@app/hook/useScrollToTop';
import useWebTitle from '@app/hook/useWebTitle';
import Footer from '@app/mtb-ui/Footer/Footer'
import Header from '@app/mtb-ui/Header/Header'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  useWebTitle();
  useScrollToTop();
  
  return (
    <div className="relative min-h-screen flex flex-col">      
      <div className="absolute top-0 left-0 right-0 h-[600px] -z-10 pointer-events-none overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
      </div>
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RootLayout