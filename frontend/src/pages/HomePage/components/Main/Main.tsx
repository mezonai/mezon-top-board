import BotListItem from '@app/components/BotListItem/BotListItem'
import BotGridItem from '@app/components/BotGridItem/BotGridItem'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useLazyMezonAppControllerSearchMezonAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { RootState } from '@app/store'
import { IMezonAppStore } from '@app/store/mezonApp'
import { ApiError } from '@app/types/API.types'
import { getPageFromParams } from '@app/utils/uri'
import { Divider, Flex, Pagination } from 'antd'
import Button from '@app/mtb-ui/Button'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { IMainProps } from './Main.types'
import { ViewMode } from '@app/enums/viewMode.enum'
import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types'
import { cn } from '@app/utils/cn'

const pageOptions = [5, 10, 15]

function Main({ isSearchPage = false }: IMainProps) {
  const { t } = useTranslation(['home_page'])
  
  const translatedSortOptions = useMemo(() => [
    { value: "createdAt_DESC", label: t('homepage.sort_options.created_newest') },
    { value: "createdAt_ASC", label: t('homepage.sort_options.created_oldest') },
    { value: "name_ASC", label: t('homepage.sort_options.name_az') },
    { value: "name_DESC", label: t('homepage.sort_options.name_za') },
    { value: "updatedAt_DESC", label: t('homepage.sort_options.updated_newest') },
    { value: "updatedAt_ASC", label: t('homepage.sort_options.updated_oldest') },
  ], [t])

  const navigate = useNavigate()
  const mainRef = useRef<HTMLDivElement>(null)
  const { mezonApp } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getMezonApp, { isError, error }] = useLazyMezonAppControllerSearchMezonAppQuery()

  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q');
  const defaultSearchQuery = useMemo(() => queryParam?.trim() || '', [queryParam]);
  const defaultTagIds = useMemo(
    () => searchParams.get('tags')?.split(',').filter(Boolean) || [],
    [searchParams.get('tags')]
  )
  const defaultType = searchParams?.get('type') as MezonAppType | undefined

  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")
  const [selectedSort, setSelectedSort] = useState<IOption>(() => ({
    value: "createdAt_DESC",
    label: t('homepage.sort_options.created_newest')
  }));

  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [page, setPage] = useState<number>(() => getPageFromParams(searchParams))

  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q')?.trim() || '')
  const [tagIds, setTagIds] = useState<string[]>(searchParams.get('tags')?.split(',').filter(Boolean) || [])
  const [type, setType] = useState<MezonAppType | undefined>(defaultType)
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST)
  const totals = useMemo(() => mezonApp.totalCount || 0, [mezonApp])

  useEffect(() => {
    getTagList()
  }, [])

  useEffect(() => {
    if (!isSearchPage) return;

    setSearchQuery(defaultSearchQuery);
    setTagIds(defaultTagIds);
    setType(defaultType);

    if (isInitialized || defaultSearchQuery || defaultTagIds.length || defaultType) {
      searchMezonAppList(defaultSearchQuery, defaultTagIds, defaultType);
    }

    setIsInitialized(true);
  }, [searchParams, page, botPerPage, selectedSort]);

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
  }, [page, botPerPage, isSearchPage, selectedSort])

  useEffect(() => {
    const newPage = getPageFromParams(searchParams)
    if (newPage !== page) {
      setPage(newPage)
    }
  }, [searchParams])

  useEffect(() => {
    setSelectedSort(translatedSortOptions[0])
    setSortField('createdAt')
    setSortOrder('DESC')
  }, [searchQuery, translatedSortOptions])

  const searchMezonAppList = (searchQuery?: string, tagIds?: string[], type?: MezonAppType) => {
    getMezonApp({
      search: isSearchPage ? searchQuery : undefined,
      tags: tagIds && tagIds.length ? tagIds : undefined,
      type,
      pageNumber: page,
      pageSize: botPerPage,
      sortField: sortField,
      sortOrder: sortOrder
    })
  }

  const listOptions = useMemo(() => {
    return pageOptions.map((value) => ({
      value,
      label: t('homepage.bots_per_page', { count: value })
    }))
  }, [t])

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    setPage(1)
    // Default: grid 36 items
    setBotPerPage(mode === 'grid' ? 36 : pageOptions[0])
  }

  const handleSortChange = (option: IOption) => {
    setSelectedSort(option)
    if (typeof option.value === 'string') {
      const [field, order] = option.value.split("_");
      setSortField(field);
      setSortOrder(order as "ASC" | "DESC");
      setPage(1);
    }
  };

  const handlePageSizeChange = (option: IOption) => {
    setBotPerPage(Number(option.value))
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)

    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage.toString())
    setSearchParams(newParams)

    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'auto' })
    }
    if (newPage > Math.ceil(totals / botPerPage)) {
      setPage(1)
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
        <Flex justify="space-between" wrap="wrap" align='center' className="gap-4">
          <div className='flex-shrink-0'>
            <MtbTypography variant='h3'>{t('homepage.mezon_bots')}</MtbTypography>
            <MtbTypography variant='h5' weight='normal'>
              {t('homepage.showing_page', { current: 1, total: mezonApp.totalPages ?? 0 })}
            </MtbTypography>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-end">
            <div className="flex items-center gap-2">
              <span className="text-secondary whitespace-nowrap">{t('homepage.sort_title')}:</span>
              <SingleSelect
                getPopupContainer={(trigger) => trigger.parentElement}
                options={translatedSortOptions}
                value={translatedSortOptions.find(o => o.value === selectedSort.value) || selectedSort}
                onChange={handleSortChange}
                size='large'
                placeholder={t('homepage.sort_placeholder')}
                className='min-w-[160px]'
                dropdownStyle={{ width: '13rem' }}
                defaultValue={translatedSortOptions[0]}
                data-e2e="selectSortOptions"
              />
            </div>

            {viewMode === 'list' && (
              <>
                <div className="hidden sm:block h-6 w-[1px] bg-border"></div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary whitespace-nowrap">{t('homepage.pagination_title')}:</span>
                  <SingleSelect
                    getPopupContainer={(trigger) => trigger.parentElement}
                    onChange={handlePageSizeChange}
                    options={listOptions}
                    value={{ value: botPerPage, label: `${botPerPage}` }}
                    placeholder='5'
                    size='large'
                    className='w-[70px]'
                    defaultValue={listOptions[0]}
                    data-e2e="selectPageOptions"
                  />
                </div>
              </>
            )}

            <div className="flex bg-container-secondary p-1 rounded-lg border border-border">
              <Button
                variant="text"
                color="default"
                icon={<BarsOutlined />}
                onClick={() => handleViewModeChange(ViewMode.LIST)}
                className={cn(
                  "min-w-[40px] px-3",
                  viewMode === ViewMode.LIST
                    ? '!bg-heading !text-primary !shadow-sm hover:!text-accent-primary'
                    : '!text-secondary hover:!text-accent-primary'
                )}
                size="middle"
              />
              <Button
                variant="text"
                color="default"
                icon={<AppstoreOutlined />}
                onClick={() => handleViewModeChange(ViewMode.GRID)}
                className={cn(
                  "min-w-[40px] px-3",
                  viewMode === ViewMode.GRID
                    ? '!bg-heading !text-primary !shadow-sm hover:!text-accent-primary'
                    : '!text-secondary hover:!text-accent-primary'
                )}
                size="middle"
              />
            </div>
          </div>
        </Flex>
        <div>
          {mezonApp?.data?.length !== 0 ? (
            <div className={cn(
              'pt-8',
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-6'
                : 'flex flex-col gap-4'
            )}>
              {mezonApp?.data?.map((bot: GetMezonAppDetailsResponse) => (
                viewMode === 'grid' ? (
                  <BotGridItem
                    key={bot.id}
                    data={bot}
                    isPublic={true}
                  />
                ) : (
                  <BotListItem
                    readonly={true}
                    key={bot.id}
                    data={bot}
                  />
                )
              ))}
            </div>
          ) : (
            <MtbTypography variant='h4' weight='normal' customClassName='!text-center !block !text-secondary'>
              {t('homepage.no_result')}
            </MtbTypography>
          )}
          <div className='flex flex-col items-center gap-5 pt-10'>
            <div className='flex flex-col items-center relative w-full'>
              <Pagination
                onChange={handlePageChange}
                pageSize={botPerPage}
                showSizeChanger={false}
                current={page}
                total={totals}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
