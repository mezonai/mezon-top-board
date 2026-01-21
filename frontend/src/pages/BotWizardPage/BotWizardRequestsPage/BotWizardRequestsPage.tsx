import { useEffect, useState, useMemo } from 'react'
import { Divider, Flex, Pagination } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import { LoadingOutlined } from '@ant-design/icons'
import BotWizardCard from './components/BotWizardCard'
import { WizardStatus } from '@app/enums/botWizard.enum'
import { useBotGeneratorControllerGetMyBotWizardsQuery } from '@app/services/api/botGenerator/botGenerator'



import { useTranslation } from "react-i18next";

const pageOptions = [6, 9, 12]

export default function BotWizardRequestsPage() {
    const { t } = useTranslation(['bot_wizard_page']);

    const statusOptions: IOption[] = useMemo(() => [
        { label: t('bot_wizard_requests.status.all'), value: 'all' },
        { label: t('bot_wizard_requests.status.processing'), value: WizardStatus.PROCESSING },
        { label: t('bot_wizard_requests.status.completed'), value: WizardStatus.COMPLETED },
        { label: t('bot_wizard_requests.status.expired'), value: WizardStatus.EXPIRED },
    ], [t]);

    const pageSizeOptions: IOption[] = useMemo(() => pageOptions.map((v) => ({ 
        value: v, 
        label: t('bot_wizard_requests.requests_per_page', { count: v }) 
    })), [t]);

    const [statusFilterValue, setStatusFilterValue] = useState<string>('all')
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(pageOptions[0])

    const queryArgs = useMemo(() => ({
        pageNumber: page,
        pageSize: pageSize,
        sortField: 'createdAt',
        sortOrder: 'DESC',
        status: statusFilterValue === 'all' ? undefined : statusFilterValue as WizardStatus,
    }), [page, pageSize, statusFilterValue])

    const { 
        data: apiData, 
        isLoading, 
        isFetching, 
    } = useBotGeneratorControllerGetMyBotWizardsQuery(queryArgs, {
        refetchOnMountOrArgChange: true, 
    })

    useEffect(() => {
        setPage(1)
    }, [statusFilterValue])

    return (
        <div className="w-full">
            <div className='flex items-center justify-between flex-wrap gap-4'>
                <div className="flex items-center gap-3">
                    <MtbTypography variant='h2'>{t('bot_wizard_requests.title')}</MtbTypography>
                </div>
            </div>
            <div className='flex items-center justify-between flex-wrap gap-4 pt-4'>
                <Flex gap={10} align='center' wrap='wrap' className='w-full'>
                    <div className='flex items-center gap-2'>
                        <SingleSelect
                            getPopupContainer={(trigger) => trigger.parentElement}
                            options={statusOptions}
                            value={statusOptions.find((o) => o.value === statusFilterValue)}
                            onChange={(opt) => setStatusFilterValue(String(opt.value))}
                            placeholder={t('bot_wizard_requests.filter_status_placeholder')}
                            size='large'
                            className='w-[13rem]'
                            dropDownTitle={t('bot_wizard_requests.filter_status_title')}
                            styles={{ popup: { root: { fontWeight: 'normal' } } }}
                        />
                        <SingleSelect
                            getPopupContainer={(trigger) => trigger.parentElement}
                            options={pageSizeOptions}
                            value={pageSizeOptions.find((o) => o.value === pageSize)}
                            onChange={(opt) => setPageSize(Number(opt.value))}
                            placeholder={t('bot_wizard_requests.page_size_placeholder')}
                            size='large'
                            className='w-[13rem]'
                            dropDownTitle={t('bot_wizard_requests.page_size_title')}
                            styles={{ popup: { root: { fontWeight: 'normal' } } }}
                        />
                    </div>
                </Flex>
            </div>
            <Divider className='bg-border' />
            {isLoading ? (
                <div className='flex items-center justify-center h-64'>
                    <LoadingOutlined style={{ fontSize: 32 }} spin />
                </div>
            ) : (apiData?.data.length === 0 ? (
                <div className='text-center text-gray-500 py-12'>{t('bot_wizard_requests.no_requests')}</div>
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
