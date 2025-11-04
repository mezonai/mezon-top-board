import { EyeOutlined, SearchOutlined, LockOutlined } from '@ant-design/icons'
import { Button, Input, Table, Tooltip, Tag, Alert, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { GetMezonAppDetailsResponse, useLazyMezonAppControllerListAdminMezonAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { formatDate } from '@app/utils/date'
import AppDetailModal from './AppDetailModal'
import AppReviewModal from './AppReviewModal'
import { AppStatus } from '@app/enums/AppStatus.enum'
import sampleBotImg from "@app/assets/images/avatar-bot-default.png";
import { getUrlMedia } from '@app/utils/stringHelper'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'

function AppReviewPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [openDetailModal, setOpenDetailModal] = useState(false)
    const [openReviewModal, setOpenReviewModal] = useState(false)
    const [detailAppData, setDetailAppData] = useState<GetMezonAppDetailsResponse | undefined>(undefined)
    const [listAdminMezonApp, { isLoading }] = useLazyMezonAppControllerListAdminMezonAppQuery()
    const dataAPI = useAppSelector((state: RootState) => state.mezonApp.mezonAppOfAdmin)
    const { data: tableData } = dataAPI || { data: [] }

    const fetchData = (page: number = pageNumber, size: number = pageSize, search: string = searchQuery) => {
        listAdminMezonApp({
            search,
            pageSize: size,
            pageNumber: page,
            sortField: 'updatedAt',
            sortOrder: 'DESC',
        })
    }

    const filteredApps = useMemo(() => {
        return (tableData || []).filter(app => app.hasNewUpdate === true);
    }, [tableData]);

    const latestVersion = useMemo(() => detailAppData?.versions?.[0], [detailAppData])

    useEffect(() => {
        fetchData()
    }, [pageNumber, pageSize])

    const handleSearch = () => {
        setPageNumber(1)
        fetchData(1, pageSize, searchQuery)
    }

    const handleView = (app: GetMezonAppDetailsResponse) => {
        setDetailAppData(app)
        setOpenDetailModal(true)
    }

    const handleOpenReview = (app: GetMezonAppDetailsResponse) => {
        setDetailAppData(app)
        setOpenReviewModal(true)
    }

    const handleCloseModals = () => {
        setOpenDetailModal(false)
        setOpenReviewModal(false)
        setDetailAppData(undefined)
    }

    const handleReviewSuccess = () => {
        fetchData();
        handleCloseModals();
    }

    const getStatusTag = (status: AppStatus) => {
        if (status === AppStatus.REJECTED) return <Tag color='red'>Rejected</Tag>
        if (status === AppStatus.PUBLISHED || status === AppStatus.APPROVED) return <Tag color='green'>Approved</Tag>
        if (status === AppStatus.PENDING) return <Tag color='gold'>Pending</Tag>
        return <Tag>Published</Tag>
    }

    const columns: ColumnsType<GetMezonAppDetailsResponse> = [
        {
            title: "Image",
            dataIndex: "featuredImage",
            key: "featuredImage",
            render: (featuredImage: string, data: GetMezonAppDetailsResponse) => (
                <img
                    src={
                        featuredImage
                            ? getUrlMedia(featuredImage)
                            : sampleBotImg
                    }
                    alt={data.name}
                    style={{ width: 100, display: 'block', margin: '0 auto' }} />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <div className='break-words max-w-[80px] 2xl:max-w-[120px]'>
                    {text}
                </div>
            )
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
            render: (owner: { name: string }) => (
                <div className='line-clamp-5 break-words max-w-[80px] 2xl:max-w-[120px]'>
                    {owner?.name || '—'}
                </div>
            )
        },
        {
            title: 'Version',
            align: 'center',
            key: 'version',
            render: (_: any, record: GetMezonAppDetailsResponse) => {
                const version = record.versions?.[0]
                return <div className='text-center'>{version?.version ?? '-'}</div>
            }
        },
        {
            title: 'Change Log',
            key: 'changelog',
            render: (_: any, record: GetMezonAppDetailsResponse) => {
                const version = record.versions?.[0]
                return (
                    <div className='line-clamp-5 overflow-hidden text-ellipsis max-w-[300px] 2xl:max-w-[400px] whitespace-pre-wrap text-sm text-gray-700'>
                        {version?.changelog || '-'}
                    </div>
                )
            }
        },
        {
            title: 'Submitted',
            align: 'center',
            key: 'submitted',
            render: (_: any, record: GetMezonAppDetailsResponse) => {
                const submitted = record.versions?.[0]?.updatedAt
                return <div className='text-center'>{formatDate(submitted, 'DD-MM-YYYY')}</div>
            }
        },
        {
            title: 'Status',
            align: 'center',
            key: 'status',
            render: (_: any, record: GetMezonAppDetailsResponse) => {
                const version = record.versions?.[0]
                const status = version?.status || record.status
                return <div className='text-center'>{getStatusTag(status)}</div>
            }
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_: any, record: GetMezonAppDetailsResponse) => (
                <div className='flex gap-3'>
                    <Tooltip title='View'>
                        <Button color='blue' variant='outlined' icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    </Tooltip>
                    <Tooltip title='Review'>
                        <Button color='cyan' variant='outlined' icon={<LockOutlined />} onClick={() => handleOpenReview(record)} />
                    </Tooltip>
                </div>
            )
        }
    ]

    return (
        <>
            {tableData && tableData.length > 0 && (() => {
                const pendingCount = filteredApps.filter(app => {
                    const version = app.versions?.[0]
                    const status = version?.status || app.status
                    return status === AppStatus.PENDING
                }).length

                if (pendingCount > 0) {
                    return (
                        <Alert
                            message={
                                <span className='text-amber-800 font-semibold'>
                                    {`${pendingCount} app${pendingCount > 1 ? 's' : ''} pending review`}
                                </span>
                            }
                            type='warning'
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                    )
                }
                return null
            })()}
            <div className='flex gap-4 mb-3'>
                <Input
                    placeholder='Search apps'
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                    onPressEnter={handleSearch}
                    className='w-full rounded-[8px] h-[40px]'
                />
                <Button className="w-50" size="large" type='primary' onClick={handleSearch} icon={<SearchOutlined />}>Search</Button>
            </div>

            {isLoading ? (
                <Spin size='large' className='text-center mt-5' />
            ) : (
                <Table
                    dataSource={filteredApps}
                    columns={columns}
                    rowKey='id'
                    pagination={{
                        current: pageNumber,
                        pageSize,
                        total: filteredApps.length,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '15'],
                        onChange: (page, size) => {
                            setPageNumber(page)
                            setPageSize(size || 5)
                        }
                    }}
                    className='cursor-pointer'
                />
            )}

            <AppDetailModal
                open={openDetailModal}
                onClose={handleCloseModals}
                appData={detailAppData}
                latestVersion={latestVersion}
            />
            <AppReviewModal
                open={openReviewModal}
                onClose={handleCloseModals}
                onUpdated={handleReviewSuccess}
                appData={detailAppData}
                latestVersion={latestVersion}
            />
        </>
    )
}

export default AppReviewPage
