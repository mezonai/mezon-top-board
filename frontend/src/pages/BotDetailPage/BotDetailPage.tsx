import BotListItem from '@app/components/BotListItem/BotListItem'
import BotGridItem from '@app/components/BotGridItem/BotGridItem'
import { TypographyStyle } from '@app/enums/typography.enum'
import { useMezonAppSearch } from '@app/hook/useSearch'
import MtbProgress from '@app/mtb-ui/ProgressBar/ProgressBar'
import MtbRate from '@app/mtb-ui/Rate/Rate'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import {
  useLazyMezonAppControllerGetMezonAppDetailQuery,
  useLazyMezonAppControllerGetRelatedMezonAppQuery
} from '@app/services/api/mezonApp/mezonApp'
import { useLazyRatingControllerGetAllRatingsByAppQuery, useLazyRatingControllerGetRatingsByAppQuery } from '@app/services/api/rating/rating'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { RootState } from '@app/store'
import { IMezonAppStore } from '@app/store/mezonApp'
import { IRatingStore } from '@app/store/rating'
import { ITagStore } from '@app/store/tag'
import { ApiError } from '@app/types/API.types'
import { Carousel, Divider, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Comment from './components/Comment/Comment'
import DetailCard from './components/DetailCard/DetailCard'
import RatingForm from './components/RatingForm/RatingForm'
import useOwnershipCheck from '@app/hook/useOwnershipCheck'
import { AppStatus } from '@app/enums/AppStatus.enum'
import Button from '@app/mtb-ui/Button'
import { transformMediaSrc } from '@app/utils/stringHelper'
import { useAuth } from '@app/hook/useAuth'
import { IUserStore } from '@app/store/user'
import { useTranslation } from 'react-i18next'
import { Clock, Tag } from 'lucide-react';
import { formatAgo } from '@app/utils/date'

function BotDetailPage() {
  const { t } = useTranslation(['bot_detail_page'])
  const navigate = useNavigate()
  const [getMezonAppDetail, { isError, error, data: getMezonAppDetailApiResponse }] = useLazyMezonAppControllerGetMezonAppDetailQuery()
  const [getrelatedMezonApp] = useLazyMezonAppControllerGetRelatedMezonAppQuery()
  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getRatingsByApp, { isLoading: isLoadingReview }] = useLazyRatingControllerGetRatingsByAppQuery()
  const [getAllRatingsByApp] = useLazyRatingControllerGetAllRatingsByAppQuery()

  const { botId } = useParams()
  const { mezonAppDetail, relatedMezonApp } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const { ratings, allRatings } = useSelector<RootState, IRatingStore>((s) => s.rating)
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)
  const { checkOwnership } = useOwnershipCheck();
  const ratingCounts = allRatings?.data?.reduce(
    (acc, rating) => {
      acc[rating.score] = (acc[rating.score] || 0) + 1
      return acc
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>
  ) || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)
  const { handleSearch } = useMezonAppSearch(1, 5)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { isLogin } = useAuth()
  const [isMobile, setIsMobile] = useState(false);

  // [Fix Error] Lấy ra version mới nhất một cách an toàn
  const latestVersion = mezonAppDetail?.versions?.[0];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (botId && botId !== 'undefined' && botId.trim() !== '') {
      getMezonAppDetail({ id: botId });
      getrelatedMezonApp({ id: botId });
      getRatingsByApp({ appId: botId });
      getAllRatingsByApp({ appId: botId });
    } else {
      navigate('/404', { replace: true });
    }
  }, [botId]);

  useEffect(() => {
    if (!tagList?.data?.length) {
      getTagList()
    }
  }, [])

  useEffect(() => {
    if (isError && error) {
      const apiError = error as ApiError
      if (mezonAppDetail.id === undefined && (apiError?.status === 500 || apiError?.status === 404)) {
        navigate('/404', { replace: true });
      } else {
        toast.error(apiError?.data?.message);
      }
    }
  }, [isError, error]);

  useEffect(() => {
    if (
      userInfo?.id &&
      getMezonAppDetailApiResponse?.data &&
      getMezonAppDetailApiResponse.data.status !== AppStatus.PUBLISHED
    ) {
      checkOwnership(getMezonAppDetailApiResponse.data.owner?.id, true);
    }
  }, [getMezonAppDetailApiResponse, userInfo])
  const onLoadMore = async () => {
    if (botId && botId !== 'undefined' && botId.trim() !== '') {
      try {
        const nextPage = page + 1
        setIsLoadingMore(true)
        await getRatingsByApp({ appId: botId, pageNumber: nextPage }).unwrap()
        setPage(nextPage)
      } catch (error) {
        toast.error(t('bot_detail.error_loading_more'))
      } finally {
        setIsLoadingMore(false)
      }
    }
  }
  const responsive = [
    {
      breakpoint: 1535,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1279,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]

  return (
    <div className='max-w-6xl mx-auto pt-10 pb-10 px-6'>
      <MtbTypography>{t('bot_detail.explore_title')}</MtbTypography>
      <div className='pt-5'>
        <SearchBar
          onSearch={(val) => handleSearch(val ?? '')}
          defaultValue={searchQuery}
          isResultPage={false}
        ></SearchBar>
      </div>
      <div className='pt-5 pb-5'>
        <BotListItem readonly={true} data={mezonAppDetail} canNavigateOnClick={false}></BotListItem>
      </div>
      <div className='sm:flex sm:gap-10 pt-5 pb-5 sm:flex-row-reverse'>
        <div className='flex-1 sm:max-w-1/4'>
          <DetailCard></DetailCard>
        </div>
        <div className='flex-3 sm:max-w-[calc(75%-2.5rem)] max-w-full mt-7'>
          <MtbTypography variant='h3' textStyle={[TypographyStyle.UNDERLINE]}>
            {t('bot_detail.overview')}
          </MtbTypography>
          <Divider className='bg-border'></Divider>
          <div dangerouslySetInnerHTML={{ __html: transformMediaSrc(mezonAppDetail.description || '') }} className='break-words description'></div>

          {latestVersion && (
            <div className='pt-8'>
              <div className="mb-4 flex items-center justify-between">
                <MtbTypography variant='h3'>{t('bot_detail.latest_version')}</MtbTypography>
                <div className="inline-flex items-center rounded-full bg-heading/10 px-3 py-1 text-sm font-semibold text-heading">
                  <Tag className="mr-1.5 h-3.5 w-3.5" /> v{latestVersion.version}
                </div>
              </div>
              <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Updated {formatAgo(new Date(latestVersion.updatedAt))}</span>
              </div>
              <div>
                <MtbTypography variant='h4' weight='semibold'>{t('bot_detail.changelog')}</MtbTypography>
                <div className="space-y-3 mb-6">
                  {latestVersion.changelog ? (
                    <div className="rounded-lg border border-border p-4 bg-container/90">
                      <MtbTypography variant='p' weight='normal' customClassName='whitespace-pre-wrap'>
                        {latestVersion.changelog}
                      </MtbTypography>
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400">No changelog details provided.</p>
                  )}
                </div>
              </div>
              <Button 
                variant='outline' 
                onClick={() => navigate(`/bot/${mezonAppDetail.id}/versions`)}
              >
                {t('bot_detail.more_versions')}
              </Button>
            </div>
          )}
          
          <Divider className='bg-border'></Divider>

          <div className='pt-5'>
            <MtbTypography variant='h3'>{t('bot_detail.more_like_this')}</MtbTypography>
            <Divider className='bg-border'></Divider>
            {relatedMezonApp?.length > 0 ? (
              <Carousel
                arrows={!isMobile}
                infinite={true}
                draggable
                swipeToSlide={true}
                touchThreshold={5}
                variableWidth={false}
                slidesToShow={3}
                responsive={responsive}
                dots={{
                  className: 'text-red',
                }}
              >
                {relatedMezonApp.map((bot) => (
                  <div className="p-1" key={bot.id}>
                    <BotGridItem data={bot} />
                  </div>
                ))}
              </Carousel>
            ) : (
              <MtbTypography variant='h4' weight='normal' customClassName='!text-secondary !text-center !block'>
                {t('bot_detail.no_related_bot')}
              </MtbTypography>
            )}
          </div>
          <div className='pt-8'>
            <MtbTypography variant='h3'>{t('bot_detail.ratings_reviews')}</MtbTypography>
            <Divider className='bg-border'></Divider>
            <div className='flex justify-between gap-4 max-lg:flex-col max-2xl:flex-col'>
              <div className='flex-1'>
                <div className='flex items-center gap-10 max-lg:justify-between max-2xl:justify-between'>
                  <p className='text-6xl'>{mezonAppDetail.rateScore}</p>
                  <div>
                    <MtbRate readonly={true} value={mezonAppDetail.rateScore}></MtbRate>
                    <p className='pt-2'>
                      {ratings?.totalCount ?? 0} {t('bot_detail.review_count', { count: ratings?.totalCount })}
                    </p>
                  </div>
                </div>
                <p className='pt-5 max-lg:pt-7 max-2xl:pt-7'>
                  {t('bot_detail.review_guidelines')}
                </p>
              </div>
              <div className='flex-1 flex flex-col gap-1'>
                {Object.keys(ratingCounts)
                  .reverse()
                  .map((key) => {
                    const ratingValue = Number(key)
                    const ratingCount = ratingCounts[ratingValue] || 0
                    const totalRatings = Object.values(ratingCounts).reduce((acc, count) => acc + count, 0)
                    const percent = ((ratingCount / totalRatings) * 100).toFixed(2)

                    return (
                      <div key={ratingValue} className='flex items-center gap-2 pb-2'>
                        <p className='whitespace-nowrap'>{ratingValue} {t('bot_detail.stars')}</p>
                        <MtbProgress percent={Number(percent)} strokeColor={'var(--accent-primary)'} showInfo={false}></MtbProgress>
                        <p className='align-middle'>{ratingCount}</p>
                      </div>
                    )
                  })}
              </div>
            </div>
            <Divider className='bg-border'></Divider>
            {isLogin && mezonAppDetail.status === AppStatus.PUBLISHED && (
              <RatingForm
                onSubmitted={() => {
                  if (botId) {
                    getRatingsByApp({ appId: botId });
                    getMezonAppDetail({ id: botId });
                  }
                }}
              />
            )}
            <Divider className='bg-border'></Divider>
            <div className='flex flex-col gap-5'>
              {isLoadingReview && Object.keys(ratings).length == 0 ? (
                <Spin size='large' />
              ) : (
                ratings?.data?.map((rating) => <Comment key={rating.id} rating={rating}></Comment>) || null
              )}
              {ratings.hasNextPage && <Button size='large' disabled={isLoadingMore} loading={isLoadingMore} onClick={onLoadMore}>{t('bot_detail.load_more')}</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotDetailPage