import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { RootState } from '@app/store'
import { ITagStore } from '@app/store/tag'
import { ISearchBarProps } from './Search.types'
import { Input, Select, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../Button'

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

  useEffect(() => {
    setSelectedTagIds(selectedTagIds.filter(Boolean));
  }, [])

  const handleClear = () => {
    setSearchText('')
    setSelectedTagIds([])
    setSearchParams({})
    if (isResultPage) {
      onSearch('', [])
    }
  }

  const updateSearchParams = (q: string, tags: string[]) => {
    setSearchParams({ q, tags: tags.join(',') }, { replace: true })
  }

  const handleSearch = (inpSearchTags?: string[]) => {
    const searchTags = inpSearchTags || selectedTagIds;

    if (!isResultPage) {
      const type = searchParams.get('type') ?? '';

      navigate(
        `/search?q=${encodeURIComponent(searchText)}&tags=${searchTags.join(',')}&type=${encodeURIComponent(type)}`
      );
      return;
    }

    updateSearchParams(searchText, searchTags)
    onSearch(searchText.trim(), searchTags)
  }

  const handleSearchTag = (tagId: string) => {
    const updatedTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId]

    setSelectedTagIds(updatedTagIds);    
    handleSearch(updatedTagIds);
  }

  const totalTags = tagList?.data?.length || 0
  const hiddenTagsCount = totalTags - MAX_VISIBLE_TAGS
  const visibleTags = tagList?.data?.filter((tag, index) =>
    showAllTags ||
    index < MAX_VISIBLE_TAGS ||
    selectedTagIds.includes(tag.id)
  ) || [];


const [isSelectVisible, setIsSelectVisible] = useState(false);

const hiddenTags = tagList?.data?.slice(MAX_VISIBLE_TAGS) || [];

const selectedHiddenTagCount = selectedTagIds.filter(id =>
  hiddenTags.some(tag => tag.id === id)
).length;

const remainingHiddenTagCount = hiddenTags.length - selectedHiddenTagCount;
  return (
    <>
      <div className='flex md:flex-row flex-col gap-4 md:gap-15 items-center'>
        <div style={{ width: '100%' }}>
          <Input
            // {...props}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              borderRadius: '100px',
              height: '50px'
            }}
            placeholder={placeholder}
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            suffix={
              allowClear && (searchText || selectedTagIds.length) ? (
                <button onClick={handleClear} className='cursor-pointer flex align-middle'>
                  <CloseCircleOutlined className='text-sm' />
                </button>
              ) : null
            }
            onPressEnter={() => handleSearch()}
          />
        </div>
        {isShowButton && (
          <Button color='primary' variant='solid' size='large' htmlType='submit' style={{ height: '50px', minWidth: '130px' }} onClick={() => handleSearch()}>
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
                handleSearch(newSelectedTagIds);
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
      </div>
    </>
  )
}

export default SearchBar
