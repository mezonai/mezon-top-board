import { Divider } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import BotWizardSidebar from './components/BotWizardSidebar'
import BotWizardRequestsPage from './BotWizardRequestsPage/BotWizardRequestsPage'
import NewBotWizardPage from './NewBotWizardPage/NewBotWizardPage'

const WIZARD_VIEWS: Record<string, React.ReactNode> = {
  requests: <BotWizardRequestsPage />, 
  new: <NewBotWizardPage />
}

function BotWizardPage() {
  const { pathname } = useLocation()

  const activeView = useMemo(() => {
    const segment = pathname.split('/').filter(Boolean).pop() ?? ''
    return WIZARD_VIEWS[segment] || WIZARD_VIEWS['requests']
  }, [pathname])

  return (
    <div className='pt-8 pb-12 w-[90%] m-auto'>
      <MtbTypography variant='h1'>Bot Wizard</MtbTypography>
      <MtbTypography variant='h3' customClassName='!pl-0 text-gray-500 !font-normal'>
        Manage and review bot generation requests.
      </MtbTypography>
      <Divider className='bg-gray-100' />
      
      <div className='flex justify-between gap-10 max-lg:flex-col max-2xl:flex-col'>
        <div className='w-1/4 max-lg:w-full max-2xl:w-full'>
          <BotWizardSidebar />
        </div>
        <div className='flex-2 w-full'>
          {activeView}
        </div>
      </div>
    </div>
  )
}

export default BotWizardPage