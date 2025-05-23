import { Divider, Flex, Pagination } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import BotCard from '@app/components/BotCard/BotCard'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import SingleSelect, { IOption } from '@app/mtb-ui/SingleSelect'
import SearchBar from '@app/mtb-ui/SearchBar/SearchBar'
import { useLazyTagControllerGetTagsQuery } from '@app/services/api/tag/tag'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store'
import { useLazyMezonAppControllerSearchMezonAppQuery } from '@app/services/api/mezonApp/mezonApp'
import { IMezonAppStore } from '@app/store/mezonApp'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ApiError } from '@app/types/API.types'
import { IMainProps } from '@app/types/Main.type'
import { getPageFromParams } from '@app/utils/uri'

const pageOptions = [5, 10, 15]
function Main({ isSearchPage = false }: IMainProps) {
  const navigate = useNavigate()
  const mainRef = useRef<HTMLDivElement>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const defaultSearchQuery = useMemo(() => searchParams.get('q')?.trim() || '', [searchParams.get('q')?.trim()])
  const defaultTagIds = useMemo(
    () => searchParams.get('tags')?.split(',').filter(Boolean) || [],
    [searchParams.get('tags')]
  )

  const { mezonApp } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)

  const [getTagList] = useLazyTagControllerGetTagsQuery()
  const [getMezonApp, { isError, error }] = useLazyMezonAppControllerSearchMezonAppQuery()

  const [botPerPage, setBotPerPage] = useState<number>(pageOptions[0])
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [page, setPage] = useState<number>(() => getPageFromParams(searchParams))

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q')?.trim() || '')
  const [tagIds, setTagIds] = useState<string[]>(searchParams.get('tags')?.split(',').filter(Boolean) || [])

  const totals = useMemo(() => mezonApp.totalCount || 0, [mezonApp])

  useEffect(() => {
    getTagList()
    if (!isInitialized && isSearchPage) {
      setSearchQuery(defaultSearchQuery)
      setTagIds(defaultTagIds)
      searchMezonAppList(defaultSearchQuery, defaultTagIds)
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (isError && error) {
      const apiError = error as ApiError
      if (apiError?.status === 404 || apiError?.data?.statusCode === 404) {
        navigate('/*')
      } else {
        toast.error(apiError?.data?.message)
      }
    }
  }, [isError, error])

  useEffect(() => {
    searchMezonAppList(searchQuery, tagIds)
  }, [page, botPerPage, isSearchPage])

  useEffect(() => {
    const newPage = getPageFromParams(searchParams)
    if (newPage !== page) {
      setPage(newPage)
    }
  }, [searchParams])

  const searchMezonAppList = (searchQuery?: string, tagIds?: string[]) => {
    getMezonApp({
      search: isSearchPage ? searchQuery : undefined,
      tags: tagIds && tagIds.length ? tagIds : undefined,
      pageNumber: page,
      pageSize: botPerPage,
      sortField: 'createdAt',
      sortOrder: 'DESC'
    })
  }

  const options = useMemo(() => {
    return pageOptions.map((value) => {
      return {
        value,
        label: `${value} bots/page`
      }
    })
  }, [])

  const handlePageSizeChange = (option: IOption) => {
    setBotPerPage(Number(option.value))
    setPage(1)
    setIsOpen(false)
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

  const onPressSearch = (text: string, tagIds?: string[]) => {
    setSearchQuery(text)
    setTagIds(tagIds ?? [])
    if (page !== 1) {
      setPage(1)
      return
    }
    searchMezonAppList(text, tagIds)
  }

  return (
    <div ref={mainRef} className={`flex flex-col justify-center pt-8 pb-12 w-[75%] m-auto relative z-1`}>
      <Divider variant='solid' style={{ borderColor: 'gray' }}>
        <MtbTypography variant='h1' customClassName='max-md:whitespace-normal'>
          Explore millions of Mezon Bots
        </MtbTypography>
      </Divider>
      <div className='pt-3'>
        <SearchBar
          onSearch={(val, tagIds) => onPressSearch(val ?? '', tagIds)}
          defaultValue={searchQuery}
          isResultPage={isSearchPage}
        ></SearchBar>
      </div>
      <div className='pt-8'>
        <Flex justify='space-between'>
          <div>
            <MtbTypography variant='h3'>Mezon Bots</MtbTypography>
            <MtbTypography variant='h5' weight='normal'>
              Showing 1 of {mezonApp.totalPages ?? 0} page
            </MtbTypography>
          </div>
          <SingleSelect
            getPopupContainer={(trigger) => trigger.parentElement}
            onChange={handlePageSizeChange}
            options={options}
            placeholder='Select'
            size='large'
            className='w-[13rem]'
            dropDownTitle='Title'
            defaultValue={options[0]}
            onDropdownVisibleChange={(visible) => setIsOpen(visible)}
            open={isOpen}
          />
        </Flex>
        <div>
          {mezonApp?.data?.length !== 0 ? (
            <div className='flex flex-col gap-4 pt-8'>
              {mezonApp?.data?.map((bot) => <BotCard key={bot.id} data={bot} />)}
            </div>
          ) : (
            <MtbTypography variant='h4' weight='normal' customClassName='!text-center !block !text-gray-500'>
              No result
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
