import { Tag } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import MtbButton from '@app/mtb-ui/Button'
import { BotWizardResponse, WizardStatus } from '../MockData'

const statusColor: Record<WizardStatus, string> = {
    PROCESSING: 'blue',
    COMPLETED: 'green',
    EXPIRED: 'red',
}

export default function BotWizardCard({ item }: { item: BotWizardResponse }) {
    const created = new Date(item.createdAt)
    const actions = (
        <>
            <MtbButton size='large' color='primary' variant='outlined'>View Details</MtbButton>
            {item.status === WizardStatus.Completed && (
                <MtbButton size='large' color='primary' variant='solid' className='ml-2'>Download .zip</MtbButton>
            )}
        </>
    )

    return (
        <div className='rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow bg-white border border-gray-100 flex flex-col gap-3'>
            <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                    <MtbTypography variant='h3' customClassName='truncate'>{item.name}</MtbTypography>
                    <MtbTypography variant='p' customClassName='!pl-0 text-gray-500 truncate'>
                        {item.description}
                    </MtbTypography>
                </div>
                <Tag color={statusColor[item.status]} className='text-sm capitalize'>{item.status}</Tag>
            </div>

            <div className='grid grid-cols-2 gap-3 text-sm text-gray-600'>
                {item.prefix && (
                    <div>
                        <span className='text-gray-400'>Prefix:</span> <span className='font-medium'>{item.prefix}</span>
                    </div>
                )}
                <div>
                    <span className='text-gray-400'>Commands:</span> <span className='font-medium'>{item.commandsCount}</span>
                </div>
                <div>
                    <span className='text-gray-400'>Events:</span> <span className='font-medium'>{item.eventsCount}</span>
                </div>
                <div>
                    <span className='text-gray-400'>Integrations:</span>
                    <span className='font-medium'> {item.integrations.database !== 'none' ? 'DB' : 'No DB'}</span>
                    <span className='ml-2 font-medium'>{item.integrations.cache ? 'Redis' : 'No Cache'}</span>
                    <span className='ml-2 font-medium'>{item.integrations.apiClient ? 'HTTP' : 'No HTTP'}</span>
                </div>
                <div>
                    <span className='text-gray-400'>.env pairs:</span> <span className='font-medium'>{item.envPairs}</span>
                </div>
                <div>
                    <span className='text-gray-400'>Created:</span> <span className='font-medium'>{created.toLocaleString()}</span>
                </div>
            </div>

            <div className='pt-2'>
                {actions}
            </div>
        </div>
    )
}
