import { useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { UnorderedListOutlined, PlusOutlined } from '@ant-design/icons'
import MtbTypography from '@app/mtb-ui/Typography/Typography'

type WizardLink = { name: string; path: string; icon: ReactNode }

const links: WizardLink[] = [
    { name: 'Requests', path: '/bot-wizard', icon: <UnorderedListOutlined /> },
    { name: 'Bot Wizard', path: '/bot-wizard/new', icon: <PlusOutlined /> },
]

export default function BotWizardSidebar() {
    const { pathname } = useLocation()

    return (
        <div className='flex flex-col gap-5 p-4 shadow-sm rounded-2xl w-full'>
            <MtbTypography variant='h2'>Navigation</MtbTypography>
            <ul className='pt-1'>
                {links.map((l) => {
                    const isActive = pathname === l.path
                    return (
                        <li
                            key={l.path}
                            className={`p-2 cursor-pointer align-middle transition-all rounded-md border ${isActive
                                ? 'border-primary text-heading font-semibold'
                                : 'border-transparent hover:text-white'
                                }`}
                        >
                            <a href={l.path} className='w-full inline-block font-medium'>
                                <span className='mr-4 align-middle'>{l.icon}</span>
                                <span className='align-middle'>{l.name}</span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
