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
      navigate(`/search?q=${encodeURIComponent(searchText)}&tags=${searchTags.join(',')}`)
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
        {tagList?.data?.slice(0, showAllTags ? totalTags : MAX_VISIBLE_TAGS).map((tag) => (
          <Tag.CheckableTag
            key={tag.id}
            checked={selectedTagIds.includes(tag?.id)}
            className='!border !border-gray-300'
            // color={selectedTagIds.includes(tag?.id) ? tag.tagSelectedColor : tag.tagColor}
            onClick={() => handleSearchTag(tag?.id)}
          >
            {tag.name}
          </Tag.CheckableTag>
        ))}
        {tagList?.data?.slice(showAllTags ? totalTags : MAX_VISIBLE_TAGS, totalTags)
          ?.filter((tag) => selectedTagIds.includes(tag.id))
          .map((tag) => (
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
          
          <Select
            mode="multiple"
            placeholder={`+${hiddenTagsCount} tags`}
            value={selectedTagIds}
            onChange={(newSelectedTags: string[]) => {
              setSelectedTagIds(newSelectedTags)
              handleSearch(newSelectedTags)
            }}
            style={{ width: '10%', marginTop: '8px' }}
            dropdownStyle={{ width: '20%' }}
            maxTagCount={0} 
            maxTagPlaceholder={() => `+${hiddenTagsCount - selectedTagIds.length} tags`}
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            options={
              tagList?.data?.slice(showAllTags ? totalTags : MAX_VISIBLE_TAGS, totalTags).map(tag => ({
                label: tag.name,
                value: tag.id
              })) || []
            }
          />
        )}
      </div>
    </>
  )
}

export default SearchBar
