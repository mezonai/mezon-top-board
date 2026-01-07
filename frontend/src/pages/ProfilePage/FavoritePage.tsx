import { useState, useMemo } from 'react'
import { Divider, Pagination, Flex, Spin } from 'antd'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import Button from '@app/mtb-ui/Button'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import { CardInfo } from './components'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import { useTranslation } from "react-i18next"
import BotGridItem from '@app/components/BotGridItem/BotGridItem'
import BotListItem from '@app/components/BotListItem/BotListItem'
import { useFavoriteAppControllerGetFavoriteAppsQuery } from '@app/services/api/favoriteApp/favoriteApp'
import { cn } from '@app/utils/cn'

type ViewMode = 'list' | 'grid';

function FavoritePage() {
    const { t } = useTranslation(['profile_page', 'home_page']);
    useAuthRedirect()
    const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)

    const pageOptions = useMemo(() => [
        { value: 6, label: '6' },
        { value: 12, label: '12' },
        { value: 18, label: '18' },
        { value: 24, label: '24' },
    ], []);

    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(6)
    const [viewMode, setViewMode] = useState<ViewMode>('grid')

    const { data: favoriteData, isLoading, isFetching } = useFavoriteAppControllerGetFavoriteAppsQuery({
        pageNumber: page,
        pageSize: pageSize,
        sortField: 'createdAt',
        sortOrder: 'DESC'
    }, {
        skip: !userInfo?.id
    })

    const appList = favoriteData?.data || []
    const totalCount = favoriteData?.totalCount || 0
    const totalPages = favoriteData?.totalPages || 0

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handlePageSizeChange = (option: IOption) => {
        const newSize = Number(option.value)
        setPageSize(newSize)
        setPage(1)
    }

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode)
    }

    return (
        <div className='pt-8 pb-12 w-3/4 m-auto'>
            <MtbTypography variant='h1'>{t('profile.my_favorites.title')}</MtbTypography>
            <Divider className='bg-border' />

            <div className='flex justify-between gap-15 max-lg:flex-col max-2xl:flex-col'>
                <div className='w-1/3 max-lg:w-full max-2xl:w-full flex-shrink-0'>
                    <CardInfo userInfo={userInfo} />
                </div>
                <div className='flex-1 min-w-0'>
                    {totalPages !== 0 && (
                        <div className='pb-6'>
                            <Flex justify="space-between" wrap="wrap" align="center" className="gap-4">
                                <div className='flex-shrink-0'>
                                    <MtbTypography variant='h5' weight='normal'>
                                        {t('profile.showing_page', { current: page, total: totalPages })}
                                    </MtbTypography>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 sm:gap-4 justify-end">
                                    <div className="flex items-center gap-2">
                                        <span className="text-secondary whitespace-nowrap hidden sm:block text-sm">
                                            {t('profile.bots_per_page')}:
                                        </span>
                                        <SingleSelect
                                            getPopupContainer={(trigger) => trigger.parentElement}
                                            onChange={handlePageSizeChange}
                                            options={pageOptions}
                                            placeholder='6'
                                            size='large'
                                            className='w-[70px]'
                                            value={pageOptions.find(o => o.value === pageSize)}
                                        />
                                    </div>
                                    <div className="flex bg-container-secondary p-1 rounded-lg border border-border flex-shrink-0">
                                        <Button
                                            variant="text"
                                            color="default"
                                            icon={<AppstoreOutlined />}
                                            onClick={() => handleViewModeChange('grid')}
                                            className={cn(
                                                "min-w-8 px-3",
                                                viewMode === 'grid'
                                                    ? '!bg-heading !text-primary !shadow-sm hover:!text-accent-primary'
                                                    : '!text-secondary hover:!text-accent-primary'
                                            )}
                                            size="middle"
                                        />
                                        <Button
                                            variant="text"
                                            color="default"
                                            icon={<BarsOutlined />}
                                            onClick={() => handleViewModeChange('list')}
                                            className={cn(
                                                "min-w-8 px-3",
                                                viewMode === 'list'
                                                    ? '!bg-heading !text-primary !shadow-sm hover:!text-accent-primary'
                                                    : '!text-secondary hover:!text-accent-primary'
                                            )}
                                            size="middle"
                                        />
                                    </div>
                                </div>
                            </Flex>
                        </div>
                    )}

                    {(isLoading || isFetching) ? (
                        <div className='flex items-center justify-center h-64'>
                            <Spin size='large' />
                        </div>
                    ) : totalPages === 0 ? (
                        <div className='pt-8'>
                            <div className='text-center py-12 text-secondary'>{t('profile.no_result')}</div>
                        </div>
                    ) : (
                        <>
                            <div className={cn(
                                'pt-2',
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                                    : 'flex flex-col gap-4'
                            )}>
                                {appList.map((item: any) => (
                                    viewMode === 'grid' ? (
                                        <div key={item.id} className="h-full">
                                            <BotGridItem data={item} isPublic={false} />
                                        </div>
                                    ) : (
                                        <BotListItem
                                            key={item.id}
                                            data={item}
                                            readonly={true}
                                        />
                                    )
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

export default FavoritePage