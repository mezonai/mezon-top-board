import useScrollToTop from '@app/hook/useScrollToTop';
import useWebTitle from '@app/hook/useWebTitle';
import Footer from '@app/mtb-ui/Footer/Footer'
import Header from '@app/mtb-ui/Header/Header'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  useWebTitle();
  useScrollToTop();
  return (
    <div>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  )
}

export default RootLayout
