import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { RootState } from '@app/store'
import { ITagStore } from '@app/store/tag'
import { ISearchBarProps } from './Search.types'
import { Input, Select, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../Button'
import { MezonAppType } from '@app/enums/mezonAppType.enum'

const typeFilterOptions: { label: string; value: MezonAppType | null }[] = [
  { label: 'All Types', value: null },
  { label: 'Bot', value: MezonAppType.BOT },
  { label: 'App', value: MezonAppType.APP },
]

const MAX_VISIBLE_TAGS = 10

const SearchBar = ({
  placeholder = 'Search',
  allowClear = true,
  onSearch,
  isShowButton = true,
  isResultPage = false,
}: ISearchBarProps) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { tagList } = useSelector<RootState, ITagStore>((s) => s.tag)

  const defaultTags = searchParams.get('tags')?.split(',') || []

  const [showAllTags, setShowAllTags] = useState(false)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(defaultTags)
  const [searchText, setSearchText] = useState<string>(searchParams.get('q') || '')
  const [selectedType, setSelectedType] = useState<MezonAppType>()

  useEffect(() => {
    setSelectedTagIds(selectedTagIds.filter(Boolean))
    const typeParam: MezonAppType | undefined = searchParams.get('type') as MezonAppType | undefined

    setSelectedType(typeParam)
  }, [])

  const handleClear = () => {
    setSearchText('')
    if (isResultPage) {
      updateSearchParams('', selectedTagIds, selectedType)
      onSearch('', selectedTagIds, selectedType)
    }
  }

  const handleClearTags = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTagIds([]);
    handleSearch([], selectedType); 
  }

  const updateSearchParams = (q: string, tags: string[], type?: MezonAppType) => {
    const params: Record<string, string> = { q, tags: tags.join(','), }
    params.type = type || ''
    setSearchParams(params, { replace: true })
  }

  const handleSearch = (inpSearchTags?: string[], inpSearchType?: MezonAppType) => {
    const searchTags = inpSearchTags || selectedTagIds
    const type = inpSearchType
    if (!isResultPage) {
      navigate(
        `/search?q=${encodeURIComponent(searchText)}&tags=${searchTags.join(',')}&type=${encodeURIComponent(type ?? '')}`
      );
      return
    }

    updateSearchParams(searchText, searchTags, type)
    onSearch(searchText.trim(), searchTags, type)
  }

  const handleSearchTag = (tagId: string) => {
    const updatedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId]

    setSelectedTagIds(updatedTagIds);
    handleSearch(updatedTagIds, selectedType);
  }

  const totalTags = tagList?.data?.length || 0
  const hiddenTagsCount = totalTags - MAX_VISIBLE_TAGS
  const visibleTags = tagList?.data?.filter((tag, index) =>
    showAllTags ||
    index < MAX_VISIBLE_TAGS ||
    selectedTagIds.includes(tag.id)
  ) || [];

  const [isSelectVisible, setIsSelectVisible] = useState(false);

  const hiddenTags = tagList?.data?.slice(MAX_VISIBLE_TAGS) || []

  const selectedHiddenTagCount = selectedTagIds.filter((id) =>
    hiddenTags.some((tag) => tag.id === id)
  ).length

  const handleTypeChange = (_value: MezonAppType | null) => {
    const value = _value || undefined;
    setSelectedType(value)
    handleSearch(selectedTagIds, value)
  }

  const remainingHiddenTagCount = hiddenTags.length - selectedHiddenTagCount

  return (
    <>
      <div className='flex md:flex-row flex-col gap-4 md:gap-15 items-center'>
        <div className="flex flex-1 w-full items-center !rounded-full my-select-container">
          <style>
            {`
              .my-select-container .ant-select .ant-select-selector {
                border-radius:0 100px 100px 0 !important;
                border-left: none !important;
              }
            `}
          </style>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={placeholder}
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            suffix={
              allowClear && searchText ? (
                <button onClick={handleClear} className='cursor-pointer flex align-middle'>
                  <CloseCircleOutlined className='text-sm' />
                </button>
              ) : null
            }
            className="!rounded-l-full h-[50px] "
            onPressEnter={() => handleSearch(selectedTagIds, selectedType)}
          />
          <Select
            value={selectedType || null}
            onChange={handleTypeChange}
            options={typeFilterOptions}
            placeholder="All Types"
            className="!h-[50px] sm:min-w-1/4 lg:min-w-1/5 min-w-1/3"
            data-e2e="selectType"
          />
        </div>
        {isShowButton && (
          <Button color='primary' variant='solid' size='large' htmlType='submit' style={{ height: '50px', minWidth: '130px' }}
            onClick={() => handleSearch(selectedTagIds, selectedType)}>
            Search
          </Button>
        )}
      </div>
      <div className={`pt-5 cursor-pointer`}>
        {visibleTags.map((tag) => (
          <Tag.CheckableTag
            key={tag.id}
            checked={selectedTagIds.includes(tag.id)}
            className='!border !border-gray-300'
            onClick={() => handleSearchTag(tag.id)}
          >
            {tag.name}
          </Tag.CheckableTag>
        ))}
        {!showAllTags && totalTags > 10 && (
          !isSelectVisible ? (
            <Tag
              className="!mb-2 cursor-pointer"
              onClick={() => setIsSelectVisible(true)}
            >
              +{remainingHiddenTagCount} tags
            </Tag>
          ) : (
            <Select
              mode="multiple"
              showSearch
              autoFocus
              open
              value={selectedTagIds}
              onChange={(newSelectedTagIds: string[]) => {
                setSelectedTagIds(newSelectedTagIds);
                handleSearch(newSelectedTagIds, selectedType);
              }}
              onBlur={() => setIsSelectVisible(false)}
              style={{ width: '120px', marginTop: '8px' }}
              dropdownStyle={{ width: '200px' }}
              maxTagCount={0}
              maxTagPlaceholder={() => `+${remainingHiddenTagCount} tags`}
              filterOption={(input, option) =>
                (option?.label as string).toLowerCase().includes(input.toLowerCase())
              }
              options={hiddenTags.map(tag => ({
                label: tag.name,
                value: tag.id
              }))}
            />
          )
        )}
        {selectedTagIds.length > 0 && (
            <Tag 
                className="!border-red-200 !text-red-500 hover:!bg-red-50 flex items-center gap-1" 
                onClick={handleClearTags}
            >
                <CloseCircleOutlined /> Clear tags
            </Tag>
        )}
      </div>
    </>
  )
}

export default SearchBar
