import { SearchOutlined } from '@ant-design/icons'
import { Input, Table, Tag, Alert, Spin, Typography } from 'antd'
import TableActionButton from '@app/components/TableActionButton/TableActionButton'
import type { ColumnsType } from 'antd/es/table'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useLazyMezonAppControllerListAdminMezonAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { GetMezonAppDetailsResponse, OwnerInMezonAppDetailResponse, AppVersionDetailsDto } from '@app/services/api/mezonApp/mezonApp.types'
import { formatDate } from '@app/utils/date'
import PreviewModal from '@app/components/PreviewModal/PreviewModal'
import AppReviewModal from './AppReviewModal'
import { AppStatus } from '@app/enums/AppStatus.enum'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import TableImage from '@app/components/TableImage/TableImage'

function AppReviewPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [openDetailModal, setOpenDetailModal] = useState(false)
    const [openReviewModal, setOpenReviewModal] = useState(false)
    const [detailAppData, setDetailAppData] = useState<GetMezonAppDetailsResponse | undefined>(undefined)
    const [listAdminMezonApp, { isLoading }] = useLazyMezonAppControllerListAdminMezonAppQuery()
    const dataAPI = useAppSelector((state: RootState) => state.mezonApp.mezonAppOfAdmin)
    const { totalCount = 0, data: tableData = [] } = dataAPI || {}

    const fetchData = (page: number = pageNumber, size: number = pageSize, search: string = searchQuery) => {
        listAdminMezonApp({
            search,
            pageSize: size,
            pageNumber: page,
            sortField: 'updatedAt',
            sortOrder: 'DESC',
            hasNewUpdate: true,
        })
    }

    const latestVersion = useMemo((): AppVersionDetailsDto | undefined => 
        detailAppData?.versions?.[0], 
        [detailAppData]
    );

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
            width: 80,
            render: (featuredImage: string, data: GetMezonAppDetailsResponse) => (
                <TableImage src={featuredImage} alt={data.name} />
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
            render: (owner: OwnerInMezonAppDetailResponse) => (
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
                    <Typography.Paragraph
                        ellipsis={{ rows: 2, expandable: false }}>
                        {version?.changelog || '-'}
                    </Typography.Paragraph>
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
            title: 'App Status',
            align: 'center',
            key: 'status',
            render: (_: any, record: GetMezonAppDetailsResponse) => {
                const status = record?.status
                return <div className='text-center'>{getStatusTag(status)}</div>
            }
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_: any, record: GetMezonAppDetailsResponse) => (
                <div className='flex gap-3'>
                    <TableActionButton
                        actionType="view"
                        onClick={() => handleView(record)}
                    />
                    <TableActionButton
                        actionType="review"
                        onClick={() => handleOpenReview(record)}
                    />
                </div>
            )
        }
    ]

    return (
        <>
            <h2 className='font-bold text-lg mb-3'>Manage App Review</h2>
            {(totalCount ?? 0) >=0 && (() => {
                return (
                    <Alert
                        message={
                            <span className='text-amber-800 font-semibold'>
                                {`${totalCount} app${totalCount > 1 ? 's' : ''} pending review`}
                            </span>
                        }
                        type='warning'
                        showIcon
                        style={{ marginBottom: 16, padding: 10 }}
                    />
                )
            })()}
            <div className='flex gap-4 mb-3'>
                <Input
                    size="large"
                    placeholder='Search apps'
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    prefix={<SearchOutlined style={{ color: 'var(--text-secondary)' }} />}
                    onPressEnter={handleSearch}
                    className='w-full rounded-lg'
                />
                <TableActionButton
                    actionType="search"
                    onClick={handleSearch}
                >
                    Search
                </TableActionButton>
            </div>

            {isLoading ? (
                <Spin size='large' className='text-center mt-5' />
            ) : (
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
                    className='cursor-pointer'
                />
            )}

            <PreviewModal
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
