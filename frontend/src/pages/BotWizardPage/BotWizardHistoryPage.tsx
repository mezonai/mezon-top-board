import { useState } from 'react'
import { Divider, Pagination } from 'antd'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import { BotWizardResponse, useMockBotWizardExpiredRequests } from './MockData'
import BotWizardCard from './components/BotWizardCard'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { LoadingOutlined } from '@ant-design/icons'

const pageOptions = [6, 9, 12]
const pageSizeOptions: IOption[] = pageOptions.map((v) => ({ value: v, label: `${v} requests/page` }))

export default function BotWizardHistoryPage() {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(pageOptions[0])
    // TODO: Replace with real hook later
    const { data, isLoading } = useMockBotWizardExpiredRequests({ page, pageSize })

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between flex-wrap gap-4'>
                <MtbTypography variant='h2'>Bot Wizard History</MtbTypography>
            </div>
            <div className='flex items-center justify-between flex-wrap gap-4'>
                <SingleSelect
                    getPopupContainer={(trigger) => trigger.parentElement}
                    options={pageSizeOptions}
                    value={pageSizeOptions.find((o) => o.value === pageSize)}
                    onChange={(opt) => { setPageSize(Number(opt.value)); setPage(1) }}
                    placeholder='Page size'
                    size='large'
                    className='w-[13rem]'
                    dropDownTitle='Page size'
                    dropdownStyle={{ fontWeight: 'normal' }}
                />
            </div>
            <Divider className='bg-gray-100' />
            {isLoading ? (
                <div className='flex items-center justify-center h-64'>
                    <LoadingOutlined style={{ fontSize: 32 }} spin />
                </div>
            ) : ((data?.data ?? []).length === 0 ? (
                <div className='text-center text-gray-500 py-12'>No expired requests.</div>
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
