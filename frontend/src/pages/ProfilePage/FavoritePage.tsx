import { Divider } from 'antd'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import { CardInfo } from './components'
import { useTranslation } from "react-i18next"
import { ViewMode } from '@app/enums/viewMode.enum'
import { useFavoriteAppControllerGetFavoriteAppsQuery } from '@app/services/api/favoriteApp/favoriteApp'
import BotDirectory from '@app/components/BotDirectory/BotDirectory'
import { useBotDirectory } from '@app/hook/useBotDirectory'
import { BotDirectoryVariant } from '@app/enums/BotDirectory.enum'

function FavoritePage() {
    const { t } = useTranslation(['profile_page', 'home_page']);
    useAuthRedirect()
    const { userInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)

    const {
        page,
        pageSize,
        viewMode,
        sortField,
        sortOrder,
        handlePageChange,
        handlePageSizeChange,
        handleViewModeChange
    } = useBotDirectory({ initialViewMode: ViewMode.GRID });

    const { data: favoriteData, isLoading, isFetching, refetch } = useFavoriteAppControllerGetFavoriteAppsQuery({
        pageNumber: page,
        pageSize: pageSize,
        sortField: sortField,
        sortOrder: sortOrder
    }, {
        skip: !userInfo?.id
    })

    const appList = favoriteData?.data || []
    const totalCount = favoriteData?.totalCount || 0

    return (
        <div className='pt-8 pb-12 w-[75%] m-auto'>
            <MtbTypography variant='h1'>{t('profile.my_favorites.title')}</MtbTypography>
            <Divider className='bg-border' />

            <div className='flex justify-between gap-15 max-lg:flex-col max-2xl:flex-col'>
                <div className='w-1/3 max-lg:w-full max-2xl:w-full flex-shrink-0'>
                    <CardInfo userInfo={userInfo} />
                </div>

                <div className='min-w-0'>
                    <BotDirectory
                        variant={BotDirectoryVariant.COMPACT}
                        isPublic={true}
                        showSort={false}
                        showTitle={false}
                        data={appList}
                        isLoading={isLoading || isFetching}
                        onRefresh={refetch}
                        currentPage={page}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        viewMode={viewMode}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        onViewModeChange={handleViewModeChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default FavoritePage