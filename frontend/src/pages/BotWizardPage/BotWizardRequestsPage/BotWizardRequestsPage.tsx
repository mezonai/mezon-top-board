import { useEffect, useState } from 'react'
import { Divider, Flex, Pagination } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import { BotWizardResponse, WizardStatus, useMockBotWizardRecentRequests } from '../MockData'
import BotWizardCard from './components/BotWizardCard'
import { LoadingOutlined } from '@ant-design/icons'

const statusOptions: IOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Processing', value: WizardStatus.Processing },
    { label: 'Completed', value: WizardStatus.Completed },
    { label: 'Expired', value: WizardStatus.Expired },
]

const pageOptions = [6, 9, 12]
const pageSizeOptions: IOption[] = pageOptions.map((v) => ({ value: v, label: `${v} requests/page` }))

export default function BotWizardRequestsPage() {
    const [status, setStatus] = useState<IOption>(statusOptions[0])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(pageOptions[0])

    const toStatusFilter = (v: unknown): 'all' | WizardStatus => {
        if (v === 'all') return 'all'
        if (v === WizardStatus.Processing || v === WizardStatus.Completed || v === WizardStatus.Expired) {
            return v
        }
        return 'all'
    }

    // TODO: Replace with real hook later
    const { data, isLoading } = useMockBotWizardRecentRequests({
        status: toStatusFilter(status.value),
        page,
        pageSize,
    })

    useEffect(() => {
        setPage(1)
    }, [status])

    return (
        <div className="w-full">
            <div className='flex items-center justify-between flex-wrap gap-4'>
                <MtbTypography variant='h2'>Bot Wizard Requests</MtbTypography>
            </div>
            <div className='flex items-center justify-between flex-wrap gap-4 pt-4'>
                <Flex gap={10} align='center' wrap='wrap' className='w-full'>
                    <div className='flex items-center gap-2'>
                        <SingleSelect
                            getPopupContainer={(trigger) => trigger.parentElement}
                            options={statusOptions}
                            value={status}
                            onChange={(opt) => setStatus(opt)}
                            placeholder='Filter by status'
                            size='large'
                            className='w-[13rem]'
                            dropDownTitle='Status'
                            dropdownStyle={{ fontWeight: 'normal' }}
                        />
                        <SingleSelect
                            getPopupContainer={(trigger) => trigger.parentElement}
                            options={pageSizeOptions}
                            value={pageSizeOptions.find((o) => o.value === pageSize)}
                            onChange={(opt) => setPageSize(Number(opt.value))}
                            placeholder='Page size'
                            size='large'
                            className='w-[13rem]'
                            dropDownTitle='Page size'
                            dropdownStyle={{ fontWeight: 'normal' }}
                        />
                    </div>
                </Flex>
            </div>
            <Divider className='bg-gray-100' />
            {isLoading ? (
                <div className='flex items-center justify-center h-64'>
                    <LoadingOutlined style={{ fontSize: 32 }} spin />
                </div>
            ) : ((data?.data ?? []).length === 0 ? (
                <div className='text-center text-gray-500 py-12'>No requests found.</div>
            ) : (
                <>
                    <div className='grid grid-cols-1 gap-6'>
                        {(data?.data ?? []).map((item: BotWizardResponse) => (
                            <BotWizardCard key={item.id} item={item} />
                        ))}
                    </div>
                    <div className='flex flex-col items-center gap-5 pt-10'>
                        <div className='flex flex-col items-center relative w-full'>
                            <Pagination
                                onChange={(p) => setPage(p)}
                                pageSize={pageSize}
                                showSizeChanger={false}
                                current={page}
                                total={data?.totalCount ?? 0}
                            />
                        </div>
                    </div>
                </>
            ))}
        </div>
    )
}
