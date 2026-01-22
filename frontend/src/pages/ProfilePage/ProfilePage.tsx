import BotDirectory from '@app/components/BotDirectory/BotDirectory'
import { useBotDirectory } from '@app/hook/useBotDirectory'
import { ViewMode } from '@app/enums/viewMode.enum'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import Button from '@app/mtb-ui/Button'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useMezonAppControllerSearchMezonAppQuery, useMezonAppControllerGetMyAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyUserControllerGetPublicProfileQuery } from '@app/services/api/user/user'
import { GetPublicProfileResponse } from '@app/services/api/user/user.types'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import { Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CardInfo } from './components'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { useAuth } from '@app/hook/useAuth'
import { useTranslation } from "react-i18next";
import { useTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { ItemVariant } from '@app/enums/ItemVariant.enum'

function ProfilePage() {
  const { t } = useTranslation(['profile_page']);
  const navigate = useNavigate()
  const { isLogin } = useAuth()
  const { userInfo: myInfo, publicProfile: publicUserInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)
  const { userId } = useParams()
  useTagControllerGetTagsQuery();
  const [userInfo, setUserInfo] = useState<GetPublicProfileResponse>()
  const [searchText, setSearchText] = useState<string>('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<MezonAppType | undefined>()
  
  const { 
    page, 
    setPage,
    pageSize, 
    viewMode, 
    sortField,
    sortOrder,
    handlePageChange, 
    handlePageSizeChange, 
    handleViewModeChange 
  } = useBotDirectory({ initialViewMode: ViewMode.GRID });

  const queryParams = {
    pageNumber: page,
    pageSize: pageSize,
    sortField: sortField, 
    sortOrder: sortOrder,
    search: searchText,
    tags: selectedTagIds,
    type: selectedType,
  };

  const { data: publicAppsData, isFetching: isPublicFetching } = useMezonAppControllerSearchMezonAppQuery(
    { ...queryParams, ownerId: userId },
    { skip: !userId } 
  );

  const { data: myAppsData, isFetching: isMyFetching } = useMezonAppControllerGetMyAppQuery(
    queryParams,
    { skip: !!userId || !isLogin } 
  );

  const mezonApp = userId ? publicAppsData : myAppsData;
  const isListLoading = userId ? isPublicFetching : isMyFetching;
  const totals = mezonApp?.totalCount || 0;

  const [queryGetPublicProfile] = useLazyUserControllerGetPublicProfileQuery()

  useAuthRedirect(!userId)

  useEffect(() => {
    if (userId) {
      queryGetPublicProfile({ userId }).unwrap();
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setUserInfo(myInfo)
      return;
    }
    if (publicUserInfo) {
      setUserInfo(publicUserInfo)
    }
  }, [userId, myInfo, publicUserInfo]);

  useEffect(() => {
    setSearchText('');
    setSelectedTagIds([]);
    setSelectedType(undefined);
    setPage(1);
  }, [userId]);

  const handleProfileSearch = (
    query: string | undefined,
    tags: string[] | undefined,
    type?: MezonAppType
  ) => {
    setSearchText(query || '');
    setSelectedTagIds(tags || []);
    setSelectedType(type);
    setPage(1);
  }

  return (
    <div className='pt-8 pb-12 w-[75%] m-auto'>
      <MtbTypography variant='h1'>{t('profile.title')}</MtbTypography>
      <Divider className='bg-border'></Divider>
      <div className='flex justify-between gap-15 max-lg:flex-col max-2xl:flex-col'>
        <div className='w-1/3 max-lg:w-full max-2xl:w-full'>
          <CardInfo userInfo={userInfo} isPublic={Boolean(userId)}></CardInfo>
        </div>

        <div className='flex-2 min-w-0'>
          <div className='flex justify-between items-center pb-4'>
            <MtbTypography variant='h2'>
              {userId
                ? t('profile.welcome_user', { name: userInfo?.name })
                : t('profile.welcome_you')}
            </MtbTypography>
            {!userId && (
              <Button color='primary' size='large' onClick={() => navigate('/new-bot')}>
                {t('profile.add_new_bot')}
              </Button>
            )}
          </div>

          <SearchBar
            onSearch={handleProfileSearch}
            isResultPage={true}
            isShowButton={false}
          />

          <div className='pt-2'>
             <BotDirectory
                variant={ItemVariant.COMPACT}
                data={mezonApp?.data || []}
                isLoading={isListLoading}
                currentPage={page}
                pageSize={pageSize}
                totalCount={totals}
                viewMode={viewMode}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onViewModeChange={handleViewModeChange}
                isPublic={Boolean(userId)}
                showSort={false}   
                showTitle={false} 
             />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage