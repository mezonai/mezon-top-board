import BotDirectory from '@app/components/BotDirectory/BotDirectory'
import { useBotDirectory } from '@app/hook/useBotDirectory'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useLazyMezonAppControllerSearchMezonAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { RootState } from '@app/store'
import { IMezonAppStore } from '@app/store/mezonApp'
import { ApiError } from '@app/types/API.types'
import { getPageFromParams } from '@app/utils/uri'
import { Divider } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { IBotSearchResultProps } from './BotSearchResult.types'
import { ViewMode } from '@app/enums/viewMode.enum'
import { BotDirectoryVariant } from '@app/enums/BotDirectory.enum'

function BotSearchResult({ isSearchPage = false }: IBotSearchResultProps) {
  const { t } = useTranslation(['home_page'])
  const navigate = useNavigate()
  const mainRef = useRef<HTMLDivElement>(null)
  const { mezonApp } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getMezonApp, { isError, error, isFetching }] = useLazyMezonAppControllerSearchMezonAppQuery()

  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q');
  const pageFromUrl = getPageFromParams(searchParams);
  const { 
    page, 
    setPage, 
    pageSize, 
    viewMode, 
    sortField, 
    sortOrder,
    selectedSort, 
    sortOptions,
    handleViewModeChange, 
    handlePageSizeChange, 
    handleSortChange
  } = useBotDirectory({ initialViewMode: ViewMode.LIST, initialPage: pageFromUrl });

  const defaultSearchQuery = useMemo(() => queryParam?.trim() || '', [queryParam]);
  const defaultTagIds = useMemo(
    () => searchParams.get('tags')?.split(',').filter(Boolean) || [],
    [searchParams.get('tags')]
  )
  const defaultType = searchParams?.get('type') as MezonAppType | undefined

  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q')?.trim() || '')
  const [tagIds, setTagIds] = useState<string[]>(searchParams.get('tags')?.split(',').filter(Boolean) || [])
  const [type, setType] = useState<MezonAppType | undefined>(defaultType)

  useEffect(() => {
    getTagList()
  }, [])

  useEffect(() => {
    const newPage = getPageFromParams(searchParams)
    if (newPage !== page) {
      setPage(newPage)
    }
  }, [searchParams])

  useEffect(() => {
    if (!isSearchPage) return;
    setSearchQuery(defaultSearchQuery);
    setTagIds(defaultTagIds);
    setType(defaultType);

    if (isInitialized || defaultSearchQuery || defaultTagIds.length || defaultType) {
      searchMezonAppList(defaultSearchQuery, defaultTagIds, defaultType);
    }
    setIsInitialized(true);
  }, [searchParams, page, pageSize, selectedSort]);

  useEffect(() => {
    if (isError && error) {
      const apiError = error as ApiError
      if (apiError?.status === 404 || apiError?.data?.statusCode === 404) {
        navigate('/404')
      } else {
        toast.error(apiError?.data?.message)
      }
    }
  }, [isError, error])

  useEffect(() => {
    searchMezonAppList(searchQuery, tagIds, type)
  }, [page, pageSize, isSearchPage, selectedSort])

  const searchMezonAppList = (searchQuery?: string, tagIds?: string[], type?: MezonAppType) => {
    getMezonApp({
      search: isSearchPage ? searchQuery : undefined,
      tags: tagIds && tagIds.length ? tagIds : undefined,
      type,
      pageNumber: page,
      pageSize: pageSize,
      sortField: sortField,
      sortOrder: sortOrder
    })
  }

  const handleMainPageChange = (newPage: number) => {
    setPage(newPage);
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage.toString())
    setSearchParams(newParams)
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }

  const onPressSearch = (text: string, tagIds?: string[], type?: MezonAppType) => {
    setSearchQuery(text)
    setTagIds(tagIds ?? [])
    setType(type)
    if (page !== 1) {
      setPage(1)
      return
    }
    searchMezonAppList(text, tagIds, type)
  }

  return (
    <div ref={mainRef} className='flex flex-col justify-center pt-8 pb-12 max-w-6xl mx-auto relative z-1 md:px-6 px-2 w-full'>
      <Divider variant='solid' className='!border-bg-secondary'>
        <MtbTypography variant='h1' customClassName='max-md:whitespace-normal'>
          {t('homepage.explore_title')}
        </MtbTypography>
      </Divider>
      <div className='pt-3'>
        <SearchBar
          onSearch={(val, tagIds, type) => onPressSearch(val ?? '', tagIds, type)}
          defaultValue={searchQuery}
          isResultPage={isSearchPage}
        ></SearchBar>
      </div>

      <div className='pt-8'>
        <BotDirectory
           variant={BotDirectoryVariant.FULL}
           data={mezonApp?.data || []}
           isLoading={isFetching}
           currentPage={page}
           pageSize={pageSize}
           totalCount={mezonApp?.totalCount || 0}
           viewMode={viewMode}
           onPageChange={handleMainPageChange} 
           onPageSizeChange={handlePageSizeChange}
           onViewModeChange={handleViewModeChange}
           sortOption={selectedSort}
           sortOptions={sortOptions}
           onSortChange={handleSortChange}
           isPublic={true}
        />
      </div>
    </div>
  )
}

export default BotSearchResult