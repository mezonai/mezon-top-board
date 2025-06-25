import CompactBotCard from '@app/components/CompactBotCard/CompactBotCard'
import { useAuth } from '@app/hook/useAuth'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import { useMezonAppSearch } from '@app/hook/useSearch'
import Button from '@app/mtb-ui/Button'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useLazyMezonAppControllerGetMyAppQuery, useLazyMezonAppControllerSearchMezonAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { GetPublicProfileResponse, useLazyUserControllerGetPublicProfileQuery } from '@app/services/api/user/user'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IMezonAppStore } from '@app/store/mezonApp'
import { IUserStore } from '@app/store/user'
import { Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { CardInfo } from './components'

function ProfilePage() {
  const navigate = useNavigate()
  const { isLogin } = useAuth()
  const { userInfo: myInfo, publicProfile: publicUserInfo } = useAppSelector<RootState, IUserStore>((s) => s.user)
  const { userId } = useParams()
  const { handleSearch } = useMezonAppSearch(1, 5)
  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getMyApp] = useLazyMezonAppControllerGetMyAppQuery()
  const [getMezonApp] = useLazyMezonAppControllerSearchMezonAppQuery()
  const [queryGetPublicProfile] = useLazyUserControllerGetPublicProfileQuery()
  const { mezonApp: userMezonApp } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { mezonAppOfUser: myMezonApp } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const [userInfo, setUserInfo] = useState<GetPublicProfileResponse>()
  const mezonApp = userId ? userMezonApp : myMezonApp

  const getData = async () => {
    if (userId) {
      getMezonApp({
        pageNumber: 1,
        pageSize: 100,
        sortField: 'createdAt',
        sortOrder: 'DESC',
        ownerId: userId
      })
      return;
    }

    if (isLogin) {
      getMyApp({
        pageNumber: 1,
        pageSize: 100,
        sortField: 'createdAt',
        sortOrder: 'DESC'
      })
    }
  }

  const initRequests = async () => {
    await getTagList()
    if (userId) {
      queryGetPublicProfile({ userId }).unwrap();
    }
    getData()
  }

  if (!userId) {
    useAuthRedirect()
  }

  useEffect(() => {
    initRequests()
  }, [])

  useEffect(() => {
    if (!userId) {
      setUserInfo(myInfo)
      return;
    }

    if (publicUserInfo) {
      setUserInfo(publicUserInfo)
    }
  }, [myInfo, publicUserInfo]);

  return (
    <div className='pt-8 pb-12 w-[75%] m-auto'>
      <MtbTypography variant='h1'>Explore millions of Mezon Bots</MtbTypography>
      <div className='pt-3'>
        <SearchBar onSearch={(val, tagIds) => handleSearch(val ?? '', tagIds)} isResultPage={false}></SearchBar>
      </div>
      <Divider className='bg-gray-100'></Divider>
      <div className='flex justify-between gap-15 max-lg:flex-col max-2xl:flex-col'>
        <div className='w-1/3 max-lg:w-full max-2xl:w-full'>
          <CardInfo userInfo={userInfo} isPublic={Boolean(userId)}></CardInfo>
        </div>
        <div className='flex-2'>
          <div className='flex justify-between items-center pb-10'>
            <MtbTypography variant='h2'>Welcome to {userId ? `${userInfo?.name}'s` : 'your'} profile</MtbTypography>
            {!userId && (
              <Button color='primary' size='large' onClick={() => navigate('/new-bot')}>
                Add new bot
              </Button>
            )}
          </div>
          <div className='grid grid-cols-1 gap-8 min-lg:grid-cols-2 min-xl:grid-cols-3 max-w-full'>
            {mezonApp?.data?.map((item) => <CompactBotCard key={item.id} data={item} isPublic={Boolean(userId)}></CompactBotCard>)}
          </div>
          {/* TODO: Add pagination */}
          {/* <div className='flex justify-center pt-10'>
            <Button
              color='primary'
              size='large'
              variant='outlined'
              onClick={() => {
                setCurrentPageNumber((prev) => prev + 1)
                getData(true)
              }}
            >
              Load more
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
