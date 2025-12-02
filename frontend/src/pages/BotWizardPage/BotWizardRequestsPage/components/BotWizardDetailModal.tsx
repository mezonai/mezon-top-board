import { Modal, Tag, Tooltip, Divider } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import type { BotWizardResponse } from '../../MockData'
import EnvPairPreviewCard from '../../NewBotWizardPage/components/EnvPairPreviewCard'
import Button from '@app/mtb-ui/Button'
import { CopyOutlined } from '@ant-design/icons'
import IntegrationTags from './IntegrationTags'

type Props = {
    open: boolean
    onClose: () => void
    item: BotWizardResponse
}

export default function BotWizardDetailModal({ open, onClose, item }: Props) {
    const created = new Date(item.createdAt)

    const copyUsage = (usage: string) => {
        if (!usage) return
        navigator?.clipboard?.writeText(usage)
    }
    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={onClose}
            title='Request Details'
            width='60%'
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
            centered
            destroyOnClose
        >
            <div className='flex flex-col gap-4'>
                <div>
                    <MtbTypography variant='h3' customClassName='!pl-0'>{item.name}</MtbTypography>
                    <div className='text-gray-600'>{item.description}</div>
                </div>

                <div className='grid grid-cols-2 gap-3 text-sm'>
                    {item.prefix && (
                        <div>
                            <span className='text-gray-400'>Prefix:</span> <span className='font-medium'>{item.prefix}</span>
                        </div>
                    )}
                    <div>
                        <span className='text-gray-400'>Created:</span> <span className='font-medium'>{created.toLocaleString()}</span>
                    </div>
                    <div className='col-span-2'>
                        <span className='text-gray-400'>Integrations:</span>
                        <IntegrationTags integrations={item.integrations} className='ml-2' />
                    </div>
                </div>

                <Divider className='bg-gray-100' />

                <div className='flex flex-col gap-3'>
                    <MtbTypography variant='h4' customClassName='!pl-0'>Commands</MtbTypography>
                    <div className='grid grid-cols-1 gap-3'>
                        {(item.commands ?? []).length === 0 ? (
                            <div className='text-gray-500 text-sm'>No commands.</div>
                        ) : (
                            (item.commands ?? []).map((c) => (
                                <div key={c.id || c.name} className='p-3 border border-gray-200 rounded-lg bg-white flex items-start justify-between gap-3'>
                                    <div>
                                        <div className='flex items-center gap-3'>
                                            <div className='font-semibold text-sm'>{c.name}</div>
                                            {c.category && <Tag color='blue'>{c.category}</Tag>}
                                        </div>
                                        {c.description && (
                                            <div className='text-xs text-gray-600 mt-1'>{c.description}</div>
                                        )}
                                        {c.aliases && c.aliases.length > 0 && (
                                            <div className='flex flex-wrap gap-2 mt-1'>
                                                {c.aliases.map((a) => <Tag key={a}>{a}</Tag>)}
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        {c.usage && (
                                            <Tooltip title='Copy usage'>
                                                <Button size='small' variant='outlined' onClick={() => copyUsage(c.usage)}>
                                                    <CopyOutlined />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <MtbTypography variant='h4' customClassName='!pl-0'>Events</MtbTypography>
                    <div className='flex flex-wrap gap-2'>
                        {(item.events ?? []).length === 0 ? (
                            <div className='text-gray-500 text-sm'>No events.</div>
                        ) : (
                            (item.events ?? []).map((e) => <Tag key={e}>{e}</Tag>)
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <MtbTypography variant='h4' customClassName='!pl-0'>Environment</MtbTypography>
                    <div className='grid grid-cols-1 gap-2'>
                        {(item.envPairs ?? []).length === 0 ? (
                            <div className='text-gray-500 text-sm'>No environment pairs.</div>
                        ) : (
                            (item.envPairs ?? []).map((p, idx) => (
                                <EnvPairPreviewCard key={`${p.key}-${idx}`} data={{ keyName: p.key, value: p.value }} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
