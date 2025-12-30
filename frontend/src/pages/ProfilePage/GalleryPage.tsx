import { useEffect, useState } from 'react'
import { Divider, Pagination, Flex, Spin } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useLazyMediaControllerGetAllMediaQuery } from '@app/services/api/media/media'
import { MediaResponse } from '@app/services/api/media/media.types'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import { getUrlMedia } from '@app/utils/stringHelper'
import { CardInfo } from './components'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'

const pageOptions = [
    { value: 12, label: '12 images/page' },
    { value: 24, label: '24 images/page' },
    { value: 36, label: '36 images/page' },
    { value: 48, label: '48 images/page' }
]

function GalleryPage() {
    useAuthRedirect()
    const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)
    const [getAllMedia, { isLoading }] = useLazyMediaControllerGetAllMediaQuery()

    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(pageOptions[0].value)
    const [mediaList, setMediaList] = useState<MediaResponse[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)

    const loadData = async (pageNumber: number = page, pageSizeParam: number = pageSize) => {
        if (!userInfo?.id) return; 
        try {
            const resp = await getAllMedia({
                pageNumber,
                pageSize: pageSizeParam,
                sortField: 'createdAt',
                sortOrder: 'DESC',
                ownerId: userInfo.id
            }).unwrap()
            setMediaList(resp?.data ?? [])
            setTotalCount(resp?.totalCount ?? 0)
            setTotalPages(resp?.totalPages ?? 0)
        } catch (_) { }
    }

    useEffect(() => {
        if (!userInfo?.id) return; 
        loadData(1, pageSize)
    }, [pageSize, userInfo?.id])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        loadData(newPage, pageSize)
    }

    const handlePageSizeChange = (option: IOption) => {
        const newSize = Number(option.value)
        setPageSize(newSize)
        setPage(1)
        loadData(1, newSize)
    }

    return (
        <div className='pt-8 pb-12 w-[75%] m-auto'>
            <MtbTypography variant='h1'>Your Media Gallery</MtbTypography>
            <Divider className='bg-border' />
            <div className='flex justify-between gap-15 max-lg:flex-col max-2xl:flex-col'>
                <div className='w-1/3 max-lg:w-full max-2xl:w-full'>
                    <CardInfo userInfo={userInfo} />
                </div>
                <div className='flex-2 w-full'>
                    {totalPages !== 0 && (
                        <div className='pb-4'>
                            <Flex justify="space-between" wrap="wrap" align="center">
                                <div className='flex-shrink-0'>
                                    <MtbTypography variant='h5' weight='normal'>
                                        Showing page {page} of {totalPages}
                                    </MtbTypography>
                                </div>
                                <Flex gap={10} align='center' wrap="wrap">
                                    <SingleSelect
                                        getPopupContainer={(trigger) => trigger.parentElement}
                                        onChange={handlePageSizeChange}
                                        options={pageOptions}
                                        placeholder='Select'
                                        size='large'
                                        className='w-[12rem] text-primary'
                                        dropDownTitle='Images per page'
                                        value={pageOptions.find(o => o.value === pageSize)}
                                    />
                                </Flex>
                            </Flex>
                        </div>
                    )}

                    {isLoading ? (
                        <div className='flex items-center justify-center h-64'>
                            <Spin size='large' />
                        </div>
                    ) : totalPages === 0 ? (
                        <div className='pt-8 text-center text-secondary'>No media uploaded yet.</div>
                    ) : (
                        <>
                            <div className='grid grid-cols-2 gap-6 min-lg:grid-cols-3 min-xl:grid-cols-4 pt-4'>
                                {mediaList.map((item: MediaResponse) => (
                                    <div key={item.id} className='rounded-xl p-2 flex flex-col gap-2 shadow-sm hover:shadow-xl transition-all duration-300 bg-container cursor-pointer border border-transparent dark:border-border'>
                                        <div className='w-full aspect-square overflow-hidden rounded-md bg-container-secondary relative group'>
                                            <img
                                                src={getUrlMedia(item.filePath)}
                                                alt={item.fileName}
                                                className='w-full h-full object-cover'
                                                onClick={() => window.open(getUrlMedia(item.filePath), '_blank')}
                                            />
                                        </div>
                                        <div className='px-1'>
                                            <MtbTypography variant='p' size={14} weight='normal' customClassName='!pl-0 truncate'>
                                                {item.fileName}
                                            </MtbTypography>
                                            <MtbTypography variant='p' size={12} weight='normal' customClassName='!pl-0 text-secondary'>
                                                {item.mimeType}
                                            </MtbTypography>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='flex flex-col items-center gap-5 pt-10'>
                                <Flex justify='center' className='w-full'>
                                    <Pagination
                                        onChange={handlePageChange}
                                        pageSize={pageSize}
                                        showSizeChanger={false}
                                        current={page}
                                        total={totalCount}
                                    />
                                </Flex>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GalleryPage