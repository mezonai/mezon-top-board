import { EyeOutlined, SearchOutlined, LockOutlined } from '@ant-design/icons'
import { Button, Input, Table, Tooltip, Tag, Alert } from 'antd'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { mockApps } from './mockData'
import type { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp'
import { formatDate } from '@app/utils/date'
import AppDetailModal from './AppDetailModal'
import AppReviewModal from './AppReviewModal'
import { AppStatus } from '@app/enums/AppStatus.enum'

function AppReviewPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [openDetailModal, setOpenDetailModal] = useState(false)
    const [openReviewModal, setOpenReviewModal] = useState(false)
    const [detailAppData, setDetailAppData] = useState<GetMezonAppDetailsResponse | undefined>(undefined)
    const [tableData, setTableData] = useState<GetMezonAppDetailsResponse[]>([])
    const [totalCount, setTotalCount] = useState(0)

    const fetchData = () => {
        // TODO: replace with API fetch
        let list = [...mockApps]
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            list = list.filter(i => i.name.toLowerCase().includes(q) || (i.headline || '').toLowerCase().includes(q))
        }
        list.sort((a, b) => a.name.localeCompare(b.name))
        const total = list.length
        const start = (pageNumber - 1) * pageSize
        const page = list.slice(start, start + pageSize)
        setTableData(page)
        setTotalCount(total)
    }

    const latestVersion = useMemo(() => detailAppData?.versions?.[0], [detailAppData])

    useEffect(() => {
        fetchData()
    }, [pageNumber, pageSize])

    const handleSearch = () => {
        setPageNumber(1)
        fetchData()
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

    const columns = [
        {
            title: 'App',
            key: 'app',
            render: (_: any, record: GetMezonAppDetailsResponse) => (
                <div className='flex items-center gap-3'>
                    <img src={record.featuredImage || '/assets/imgs/default.png'} alt={record.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    <div className='flex flex-col'>
                        <div className='font-medium'>{record.name}</div>
                        <div className='text-sm text-gray-500'>{record.headline || record.description}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'Owner',
            key: 'owner',
            render: (_: any, record: GetMezonAppDetailsResponse) => <div className='font-medium'>{record.owner?.name || '—'}</div>
        },
        {
            title: 'Version',
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
                return <div className='max-w-[400px] break-words whitespace-pre-wrap text-sm text-gray-700'>{version?.changelog || '-'}</div>
            }
        },
        {
            title: 'Submitted',
            key: 'submitted',
            render: (_: any, record: GetMezonAppDetailsResponse) => {
                const submitted = record.updatedAt
                return <div className='text-center'>{formatDate(submitted, 'DD-MM-YYYY')}</div>
            }
        },
        {
            title: 'Status',
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
                const pendingCount = tableData.filter(app => {
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
                    className='w-full'
                    style={{ borderRadius: '8px', height: '40px' }}
                />
                <Button type='primary' onClick={handleSearch} icon={<SearchOutlined />}>Search</Button>
            </div>

            <Table
                dataSource={tableData}
                columns={columns}
                rowKey='id'
                pagination={{
                    current: pageNumber,
                    pageSize,
                    total: totalCount,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15'],
                    onChange: (page, size) => {
                        setPageNumber(page)
                        setPageSize(size || 5)
                    }
                }}
            />

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
