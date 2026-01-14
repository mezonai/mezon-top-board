import BotGridItem from '@app/components/BotGridItem/BotGridItem'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import Button from '@app/mtb-ui/Button'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useMezonAppControllerSearchMezonAppQuery, useMezonAppControllerGetMyAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyUserControllerGetPublicProfileQuery } from '@app/services/api/user/user'
import { GetPublicProfileResponse } from '@app/services/api/user/user.types'
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IUserStore } from '@app/store/user'
import { Divider, Pagination, Flex } from 'antd'
import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CardInfo } from './components'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import { useAuth } from '@app/hook/useAuth'
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const { t } = useTranslation(['profile_page']);
  const pageOptions = useMemo(() => [
    { value: 6, label: t('profile.bots_per_page_option', { count: 6 }) },
    { value: 12, label: t('profile.bots_per_page_option', { count: 12 }) },
    { value: 18, label: t('profile.bots_per_page_option', { count: 18 }) },
    { value: 24, label: t('profile.bots_per_page_option', { count: 24 }) },
  ], [t]);
  const navigate = useNavigate()
  const { isLogin } = useAuth()
  const { userInfo: myInfo, publicProfile: publicUserInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)
  const { userId } = useParams()
  const [userInfo, setUserInfo] = useState<GetPublicProfileResponse>()
  const [searchText, setSearchText] = useState<string>('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<MezonAppType | undefined>()
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pageOptions[0].value);
  const queryParams = {
    pageNumber: page,
    pageSize: pageSize,
    sortField: 'createdAt',
    sortOrder: 'DESC',
    search: searchText,
    tags: selectedTagIds,
    type: selectedType,
  };

  const { data: publicAppsData } = useMezonAppControllerSearchMezonAppQuery(
    { ...queryParams, ownerId: userId },
    { skip: !userId } 
  );

  const { data: myAppsData } = useMezonAppControllerGetMyAppQuery(
    queryParams,
    { skip: !!userId || !isLogin } 
  );

  const mezonApp = userId ? publicAppsData : myAppsData;
  
  const totals = mezonApp?.totalCount || 0;
  const totalPages = mezonApp?.totalPages || 0;

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (option: IOption) => {
    setPageSize(Number(option.value));
    setPage(1);
  };

  return (
    <div className='pt-8 pb-12 w-[75%] m-auto'>
      <MtbTypography variant='h1'>{t('profile.title')}</MtbTypography>
      <Divider className='bg-border'></Divider>
      <div className='flex justify-between gap-15 max-lg:flex-col max-2xl:flex-col'>
        <div className='w-1/3 max-lg:w-full max-2xl:w-full'>
          <CardInfo userInfo={userInfo} isPublic={Boolean(userId)}></CardInfo>
        </div>

        <div className='flex-2'>
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

          {totalPages !== 0 && (
            <div className='pt-8'>
              <Flex justify="space-between" wrap="wrap">
                <div className='flex-shrink-0'>
                  <MtbTypography variant='h5' weight='normal'>
                    {t('profile.showing_page', { current: page, total: totalPages })}
                  </MtbTypography>
                </div>
                <Flex gap={10} align='center' wrap="wrap">
                  <SingleSelect
                    getPopupContainer={(trigger) => trigger.parentElement}
                    onChange={handlePageSizeChange}
                    options={pageOptions}
                    placeholder='Select'
                    size='large'
                    className='w-[10rem] text-primary'
                    dropDownTitle={t('profile.bots_per_page')}
                    value={pageOptions.find(o => o.value === pageSize)}
                  />
                </Flex>
              </Flex>
            </div>
          )}

          {totalPages === 0 ? (
            <div className='pt-8'>
              <div className='text-center py-12 text-secondary'>{t('profile.no_result')}</div>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-8 min-lg:grid-cols-2 min-xl:grid-cols-3 max-w-full pt-8'>
                {mezonApp?.data?.map((item: GetMezonAppDetailsResponse) => (
                  <BotGridItem key={item.id} data={item} isPublic={Boolean(userId)} />
                ))}
              </div>

              <div className='flex flex-col items-center gap-5 pt-10'>
                <div className='flex flex-col items-center relative w-full'>
                  <Pagination
                    onChange={handlePageChange}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    current={page}
                    total={totals}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage