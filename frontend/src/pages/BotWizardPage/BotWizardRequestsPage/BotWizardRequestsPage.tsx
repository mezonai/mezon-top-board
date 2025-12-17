import { useEffect, useState, useMemo } from 'react'
import { Divider, Flex, Pagination } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import { LoadingOutlined } from '@ant-design/icons'
import BotWizardCard from './components/BotWizardCard'
import { WizardStatus } from '@app/enums/botWizard.enum'
import { useBotGeneratorControllerGetMyBotWizardsQuery } from '@app/services/api/botGenerator/botGenerator'

const statusOptions: IOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Processing', value: WizardStatus.PROCESSING },
    { label: 'Completed', value: WizardStatus.COMPLETED },
    { label: 'Expired', value: WizardStatus.EXPIRED },
]

const pageOptions = [6, 9, 12]
const pageSizeOptions: IOption[] = pageOptions.map((v) => ({ value: v, label: `${v} requests/page` }))

export default function BotWizardRequestsPage() {
    const [statusFilter, setStatusFilter] = useState<IOption>(statusOptions[0])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(pageOptions[0])

    const queryArgs = useMemo(() => ({
        pageNumber: page,
        pageSize: pageSize,
        sortField: 'createdAt',
        sortOrder: 'DESC',
        status: statusFilter.value === 'all' ? undefined : statusFilter.value as WizardStatus,
    }), [page, pageSize, statusFilter])

    const { 
        data: apiData, 
        isLoading, 
        isFetching, 
    } = useBotGeneratorControllerGetMyBotWizardsQuery(queryArgs, {
        refetchOnMountOrArgChange: true, 
    })

    useEffect(() => {
        setPage(1)
    }, [statusFilter])

    return (
        <div className="w-full">
            <div className='flex items-center justify-between flex-wrap gap-4'>
                <div className="flex items-center gap-3">
                    <MtbTypography variant='h2'>Bot Wizard Requests</MtbTypography>
                </div>
            </div>

            <div className='flex items-center justify-between flex-wrap gap-4 pt-4'>
                <Flex gap={10} align='center' wrap='wrap' className='w-full'>
                    <div className='flex items-center gap-2'>
                        <SingleSelect
                            getPopupContainer={(trigger) => trigger.parentElement}
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(opt) => setStatusFilter(opt)}
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
            ) : (apiData?.data.length === 0 ? (
                <div className='text-center text-gray-500 py-12'>No requests found.</div>
            ) : (
                <>
                    <div className='grid grid-cols-1 gap-6'>
                        <div className={`grid grid-cols-1 gap-6 w-full ${isFetching ? 'opacity-50 pointer-events-none' : ''}`}>
                            {apiData?.data.map((item) => (
                                <BotWizardCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-5 pt-10'>
                        <div className='flex flex-col items-center relative w-full'>
                            <Pagination
                                onChange={(p) => setPage(p)}
                                pageSize={pageSize}
                                showSizeChanger={false}
                                current={page}
                                total={apiData?.totalCount ?? 0}
                            />
                        </div>
                    </div>
                </>
            ))}
        </div>
    )
}