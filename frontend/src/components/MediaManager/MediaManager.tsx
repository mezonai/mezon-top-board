import { UploadOutlined } from '@ant-design/icons'

import { useEffect, useState } from 'react'
import { Modal, Spin, Tabs, Upload, Pagination } from 'antd'
import { toast } from 'react-toastify'
import { imageMimeTypes } from '@app/constants/mimeTypes'
import {
  useLazyMediaControllerGetAllMediaQuery,
} from '@app/services/api/media/media'
import { getUrlMedia } from '@app/utils/stringHelper'
import Button from '@app/mtb-ui/Button'
import { useAppSelector } from '@app/store/hook'
import { RootState } from '@app/store'
import CropImageModal from '@app/components/CropImageModal/CropImageModal'

const MediaManagerModal = ({
  isVisible,
  onChoose,
  onClose
}: {
  isVisible: boolean
  onChoose: (path: File | string) => void
  onClose: () => void
}) => {
  const [selectedFileToCrop, setSelectedFileToCrop] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState('1')
  const [page, setPage] = useState(1);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false)

  const [getAllMedia, { isLoading: loadingMedia }] = useLazyMediaControllerGetAllMediaQuery()
  const mediaList = useAppSelector((state: RootState) => state.media.mediaList)
  const pageSize = 24

  useEffect(() => {
    getMediasList()
  }, [page])

  const getMediasList = () => {
    getAllMedia({
      pageNumber: page,
      pageSize: pageSize,
      sortField: 'createdAt',
      sortOrder: 'ASC'
    })
  }

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options
    const maxFileSize = 4 * 1024 * 1024
    if (file.size > maxFileSize) {
      toast.error(`${file.name} file upload failed (exceeds 4MB)`)
      return
    }
    if (!imageMimeTypes.includes(file.type)) {
      toast.error('Please upload a valid image file!')
      onError(new Error('Invalid file type'))
      return
    }
    setSelectedFileToCrop(file)
    onSuccess('ok')
    setIsCropModalOpen(true)
  }

  const tabItems = [
    {
      label: 'Upload from device',
      key: '1',
      children: (
        <div className='flex flex-col items-center mt-4'>
          <Upload customRequest={handleUpload} showUploadList={false} accept='image/*'>
            <Button icon={<UploadOutlined />}>
              Click to Upload
            </Button>
          </Upload>
          <i>Choose an image in your browser</i>
          {selectedFile && (
            <img
              src={selectedImage || ''}
              alt=''
              className="w-[100px] h-[100px] object-cover mt-[10px]"
            />
          )}
        </div>
      )
    },
    {
      label: 'Choose from gallery',
      key: '2',
      children: loadingMedia ? (
        <Spin />
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap gap-2 max-h-[350px] overflow-y-auto'>
            {mediaList?.data?.map((item: any) => {
              const url = getUrlMedia(item.filePath);
              return (
                <img
                  key={item.id}
                  src={url}
                  alt=''
                  className='w-[6.5rem] h-[6.5rem] object-cover cursor-pointer'
                  style={{
                    border: selectedImage === url ? '2px solid blue' : '1px solid #ccc'
                  }}
                  onClick={() => setSelectedImage(url)}
                />
              );
            })}
          </div>
          <Pagination
            onChange={(p) => setPage(p)}
            pageSize={pageSize}
            current={page}
            total={mediaList?.totalCount || 0}
            showSizeChanger={false}
            className="self-center"
          />
        </div>
      )
    }
  ]

  const handleChoose = async () => {
    try {
      if (selectedFile) {
        onChoose(selectedFile)
      }
      else if (selectedImage) {
        onChoose(selectedImage)
      } else {
        toast.error('Please select an image')
        return
      }

      setSelectedImage(null)
      setSelectedFile(null)
      setActiveTab('1')
      setPage(1)
      onClose()
    } catch (error) {
      toast.error('Upload failed!')
    }
  }

  const handleCancel = () => {
    setActiveTab('1')
    setPage(1)
    setSelectedFile(null)
    setSelectedImage(null)
    onClose()
  }

  const handleCloseModal = () => {
    setIsCropModalOpen(false)
    setSelectedFileToCrop(null)
    setSelectedFile(null)
    setSelectedImage(null)
  }

  const handleChooseCroppedImage = (file: File) => {
    setSelectedFileToCrop(null)
    setSelectedFile(file)
    setSelectedImage(URL.createObjectURL(file))
    setIsCropModalOpen(false)
  }

  return (
    <>
      <Modal zIndex={3}
        width={'59rem'}
        centered
        title='Choose Icon'
        open={isVisible}
        onCancel={handleCancel}
        onOk={handleChoose}
        footer={
          <div className="flex justify-between items-center">
            {activeTab === '2' && (
              <div className="text-sm text-gray-500 pl-2">
                Total {mediaList?.totalCount || 0} image(s)
              </div>
            )}

            <div className="ml-auto flex gap-2">
              <Button onClick={handleCancel} color="default">
                Cancel
              </Button>
              <Button onClick={handleChoose}>OK</Button>
            </div>
          </div>
        }
      >
        <Tabs className=''
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key)
            if (key === '2') {
              setSelectedFile(null)
              setIsCropModalOpen(false)
            }
          }}
          type='card'
          items={tabItems}
        />
      </Modal>
      <CropImageModal
        open={isCropModalOpen}
        imgSrc={selectedFileToCrop ? URL.createObjectURL(selectedFileToCrop) : ''}
        originalFileName={selectedFileToCrop?.name}
        aspect={1}
        onCancel={handleCloseModal}
        onConfirm={handleChooseCroppedImage}
      />
    </>
  )
}

export default MediaManagerModal