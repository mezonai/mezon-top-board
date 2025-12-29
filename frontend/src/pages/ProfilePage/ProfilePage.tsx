import BotGridItem from '@app/components/BotGridItem/BotGridItem'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import Button from '@app/mtb-ui/Button'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useLazyMezonAppControllerSearchMezonAppQuery, useLazyMezonAppControllerGetMyAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { useLazyUserControllerGetPublicProfileQuery } from '@app/services/api/user/user'
import { GetPublicProfileResponse } from '@app/services/api/user/user.types'
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IMezonAppStore } from '@app/store/mezonApp'
import { IUserStore } from '@app/store/user'
import { Divider, Pagination, Flex } from 'antd'
import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { CardInfo } from './components'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import { useAuth } from '@app/hook/useAuth'

const pageOptions = [
  { value: 6, label: "6 bots/page" },
  { value: 12, label: "12 bots/page" },
  { value: 18, label: "18 bots/page" },
  { value: 24, label: "24 bots/page" },
];

function ProfilePage() {
  const navigate = useNavigate()
  const { isLogin } = useAuth()
  const { userInfo: myInfo, publicProfile: publicUserInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)
  const { userId } = useParams()
  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getMyApp] = useLazyMezonAppControllerGetMyAppQuery()
  const [getMezonApp] = useLazyMezonAppControllerSearchMezonAppQuery()
  const [queryGetPublicProfile] = useLazyUserControllerGetPublicProfileQuery()
  const { mezonApp: userMezonApp } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { mezonAppOfUser: myMezonApp } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const [userInfo, setUserInfo] = useState<GetPublicProfileResponse>()
  const [searchText, setSearchText] = useState<string>('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<MezonAppType | undefined>()
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(pageOptions[0].value);
  const mezonApp = userId ? userMezonApp : myMezonApp;
  const totals = useMemo(() => mezonApp?.totalCount || 0, [mezonApp]);
  const totalPages = useMemo(() => mezonApp?.totalPages || 0, [mezonApp]);
  const ownerId = userId ? userId : myInfo?.id;

  const getData = async (
    query: string = searchText,
    tags: string[] = selectedTagIds,
    type: MezonAppType | undefined = selectedType,
    pageNumber: number = page
  ) => {
    if (userId) {
      getMezonApp({
        pageNumber: pageNumber,
        pageSize: pageSize,
        sortField: 'createdAt',
        sortOrder: 'DESC',
        ownerId: userId,
        search: query,
        tags: tags,
        type: type,
      });
      return;
    }

    if (isLogin) {
      getMyApp({
        pageNumber: pageNumber,
        pageSize: pageSize,
        sortField: 'createdAt',
        sortOrder: 'DESC',
        search: query,
        tags: tags,
      });
    }
  }

  useEffect(() => {
    getTagList();

    if (userId) {
      queryGetPublicProfile({ userId }).unwrap();
    }
  }, [userId]);

  useEffect(() => {
    if (ownerId) {
      setSearchText('');
      setSelectedTagIds([]);
      setSelectedType(undefined);
      setPage(1);
      getData('', [], undefined, 1);
    }
  }, [ownerId]);

  if (!userId) {
    useAuthRedirect()
  }

  useEffect(() => {
    if (!userId) {
      setUserInfo(myInfo)
      return;
    }

    if (publicUserInfo) {
      setUserInfo(publicUserInfo)
    }
  }, [myInfo, publicUserInfo]);

  const handleProfileSearch = (
    query: string | undefined,
    tags: string[] | undefined,
    type?: MezonAppType
  ) => {
    const searchQuery = query || '';
    const searchTags = tags || [];

    setSearchText(searchQuery);
    setSelectedTagIds(searchTags);
    setSelectedType(type);

    setPage(1);
    getData(searchQuery, searchTags, type, 1);
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    getData(searchText, selectedTagIds, selectedType, newPage);
  };

  const handlePageSizeChange = (option: IOption) => {
    setPageSize(Number(option.value));
    setPage(1);
    getData(searchText, selectedTagIds, selectedType, 1);
  };

  return (
    <div className='pt-8 pb-12 w-[75%] m-auto'>
      <MtbTypography variant='h1'>Your Profile</MtbTypography>
      <Divider className='bg-border'></Divider>
      <div className='flex justify-between gap-15 max-lg:flex-col max-2xl:flex-col'>
        <div className='w-1/3 max-lg:w-full max-2xl:w-full'>
          <CardInfo userInfo={userInfo} isPublic={Boolean(userId)}></CardInfo>
        </div>

        <div className='flex-2'>
          <div className='flex justify-between items-center pb-4'>
            <MtbTypography variant='h2'>Welcome to {userId ? `${userInfo?.name}'s` : 'your'} profile</MtbTypography>
            {!userId && (
              <Button color='primary' size='large' onClick={() => navigate('/new-bot')}>
                Add new bot
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
                    Showing {page} of {totalPages} page
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
                    dropDownTitle='Bots per page'
                    value={pageOptions.find(o => o.value === pageSize)}
                  />
                </Flex>
              </Flex>
            </div>
          )}

          {totalPages === 0 ? (
            <div className='pt-8'>
              <div className='text-center py-12 text-secondary'>No Result</div>
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